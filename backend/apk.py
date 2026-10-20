from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from pathlib import Path
import math

app = Flask(__name__)

CORS(app, resources={
    r"/*": {"origins": ["http://localhost:5173"]}
})

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "delivery_model.pkl"

model = joblib.load(MODEL_PATH)

FEATURES = [
    "Warehouse_block",
    "Mode_of_Shipment",
    "Cost_of_the_Product",
    "Prior_purchases",
    "Product_importance",
    "Gender",
    "Discount_offered",
    "Weight_in_gms"
]

CATEGORIES = {
    "Warehouse_block": ["A", "B", "C", "D", "F"],
    "Mode_of_Shipment": ["Ship", "Flight", "Road"],
    "Product_importance": ["low", "medium", "high"],
    "Gender": ["M", "F"]
}

NUMERIC_FIELDS = [
    "Cost_of_the_Product",
    "Prior_purchases",
    "Discount_offered",
    "Weight_in_gms"
]


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Flask backend is running"
    })


@app.route("/model-info", methods=["GET"])
def model_info():
    return jsonify({
        "model": "Random Forest",
        "task": "Binary Classification",
        "target": "Reached.on.Time_Y.N",
        "classes": {
            "0": "On Time",
            "1": "Delayed"
        },
        "features": FEATURES,
        "note": "Experimental model; validation showed limited generalization."
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "JSON object required"}), 400

    missing = [f for f in FEATURES if f not in data]

    if missing:
        return jsonify({
            "error": "Missing fields",
            "fields": missing
        }), 400

    try:
        record = {}

        for field, allowed in CATEGORIES.items():
            value = data[field]

            if value not in allowed:
                return jsonify({
                    "error": f"Invalid {field}",
                    "allowed": allowed
                }), 400

            record[field] = value

        for field in NUMERIC_FIELDS:
            value = float(data[field])

            if not math.isfinite(value) or value < 0:
                raise ValueError(
                    f"{field} must be a valid non-negative number"
                )

            record[field] = value

        if record["Weight_in_gms"] <= 0:
            raise ValueError("Weight must be greater than zero")

        if not record["Prior_purchases"].is_integer():
            raise ValueError("Prior purchases must be a whole number")

        input_df = pd.DataFrame([record], columns=FEATURES)

        prediction = int(model.predict(input_df)[0])

        probabilities = model.predict_proba(input_df)[0]
        classes = list(model.classes_)

        delay_probability = float(
            probabilities[classes.index(1)]
        )

        return jsonify({
            "prediction": prediction,
            "delivery_status": (
                "Delayed" if prediction == 1 else "On Time"
            ),
            "delay_probability": round(
                delay_probability * 100, 2
            ),
            "on_time_probability": round(
                (1 - delay_probability) * 100, 2
            ),
            "note": "Experimental prediction, not a delivery guarantee."
        })

    except (ValueError, TypeError) as error:
        return jsonify({"error": str(error)}), 400

    except Exception:
        app.logger.exception("Prediction error")
        return jsonify({
            "error": "Internal prediction error"
        }), 500


# ---------------- ANALYTICS API ----------------

DATASET_PATH = BASE_DIR / "datasets" / "E_Commerce.csv"

@app.route("/analytics", methods=["GET"])
def analytics():

    try:
        df = pd.read_csv(DATASET_PATH)

        target = "Reached.on.Time_Y.N"

        if target not in df.columns:
            return jsonify({
                "error": "Target column not found"
            }), 500

        # 1 = Delayed, 0 = On Time
        total = len(df)
        delayed = int((df[target] == 1).sum())
        on_time = int((df[target] == 0).sum())

        # Shipment mode statistics
        shipment = (
            df.groupby("Mode_of_Shipment")[target]
            .agg(["count", "mean"])
            .reset_index()
        )

        shipment_data = [
            {
                "name": str(row["Mode_of_Shipment"]),
                "total": int(row["count"]),
                "delay_rate": round(float(row["mean"]) * 100, 2)
            }
            for _, row in shipment.iterrows()
        ]

        # Warehouse statistics
        warehouse = (
            df.groupby("Warehouse_block")[target]
            .agg(["count", "mean"])
            .reset_index()
        )

        warehouse_data = [
            {
                "name": str(row["Warehouse_block"]),
                "total": int(row["count"]),
                "delay_rate": round(float(row["mean"]) * 100, 2)
            }
            for _, row in warehouse.iterrows()
        ]

        return jsonify({
            "summary": {
                "total_orders": total,
                "delayed": delayed,
                "on_time": on_time,
                "delay_rate": round(
                    delayed / total * 100, 2
                ) if total else 0
            },
            "delivery_distribution": [
                {"name": "Delayed", "value": delayed},
                {"name": "On Time", "value": on_time}
            ],
            "shipment_modes": shipment_data,
            "warehouses": warehouse_data
        })

    except Exception:
        app.logger.exception("Analytics error")

        return jsonify({
            "error": "Unable to load analytics data"
        }), 500

# -------- MODEL COMPARISON API --------

@app.route("/model-comparison", methods=["GET"])
def model_comparison():
    try:
        reports_dir = BASE_DIR / "reports"

        random_df = pd.read_csv(
            reports_dir / "model_comparison.csv"
        )

        ordered_df = pd.read_csv(
            reports_dir / "ordered_model_comparison.csv"
        )

        return jsonify({
            "random_split": random_df.to_dict(orient="records"),
            "ordered_split": ordered_df.to_dict(orient="records"),
        })

    except Exception:
        app.logger.exception("Model comparison error")
        return jsonify({
            "error": "Unable to load model comparison results"
        }), 500

@app.route("/feature-importance", methods=["GET"])
def feature_importance_api():
    try:
        folder = BASE_DIR / "reports" / "feature_importance"

        random_df = pd.read_csv(
            folder / "random_importance.csv"
        )

        ordered_df = pd.read_csv(
            folder / "ordered_importance.csv"
        )

        return jsonify({
            "random_split": random_df.to_dict(orient="records"),
            "ordered_split": ordered_df.to_dict(orient="records"),
        })

    except Exception:
        app.logger.exception("Feature importance API error")
        return jsonify({
            "error": "Unable to load feature importance"
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)