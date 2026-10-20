import matplotlib.pyplot as plt
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.metrics import accuracy_score, roc_auc_score

BASE_DIR = Path(__file__).resolve().parent
df = pd.read_csv(BASE_DIR / "datasets" / "E_Commerce.csv")

target = "Reached.on.Time_Y.N"

features = [
    "Warehouse_block",
    "Mode_of_Shipment",
    "Cost_of_the_Product",
    "Prior_purchases",
    "Product_importance",
    "Gender",
    "Discount_offered",
    "Weight_in_gms",
]

categorical = [
    "Warehouse_block",
    "Mode_of_Shipment",
    "Product_importance",
    "Gender",
]

numerical = [
    feature for feature in features
    if feature not in categorical
]

def create_model():
    preprocessing = ColumnTransformer([
        (
            "num",
            Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]),
            numerical,
        ),
        (
            "cat",
            Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("encoder", OneHotEncoder(handle_unknown="ignore")),
            ]),
            categorical,
        ),
    ])

    return Pipeline([
        ("preprocessor", preprocessing),
        ("model", RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            n_jobs=-1,
        )),
    ])

def evaluate_importance(name, X_train, X_test, y_train, y_test):
    print(f"\n{'=' * 55}")
    print(name)
    print("=" * 55)

    model = create_model()
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, predictions)
    auc = roc_auc_score(y_test, probabilities)

    print(f"Accuracy: {accuracy:.4f}")
    print(f"ROC-AUC:  {auc:.4f}")

    # Permutation importance on original input columns.
    # Scoring is based on ROC-AUC.
    result = permutation_importance(
        model,
        X_test,
        y_test,
        scoring="roc_auc",
        n_repeats=5,
        random_state=42,
        n_jobs=-1,
    )

    importance_df = pd.DataFrame({
        "Feature": features,
        "Importance": result.importances_mean,
        "Std": result.importances_std,
    }).sort_values("Importance", ascending=False)

    output_dir = BASE_DIR / "reports" / "feature_importance"
    output_dir.mkdir(parents=True, exist_ok=True)

    filename = (
        "random_importance.csv"
        if name == "Random Split"
        else "ordered_importance.csv"
    )

    importance_df.to_csv(output_dir / filename, index=False)

    print("\nPermutation importance (ROC-AUC decrease):")
    print(importance_df.to_string(index=False))

    # Plot feature importance
    plot_data = importance_df.sort_values("Importance")

    plt.figure(figsize=(10, 6))
    plt.barh(
        plot_data["Feature"],
        plot_data["Importance"],
        xerr=plot_data["Std"],
        capsize=3,
    )

    plt.axvline(0, color="black", linewidth=0.8)
    plt.xlabel("Mean decrease in ROC-AUC when shuffled")
    plt.title(f"Random Forest Feature Importance - {name}")
    plt.tight_layout()

    image_name = (
        "random_importance.png"
        if name == "Random Split"
        else "ordered_importance.png"
    )

    plt.savefig(output_dir / image_name, dpi=200)
    plt.close()

    return importance_df

# Random train/test split
X = df[features]
y = df[target].astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

evaluate_importance(
    "Random Split",
    X_train,
    X_test,
    y_train,
    y_test,
)

# Ordered-ID train/test split
ordered_df = df.sort_values("ID").reset_index(drop=True)

split_index = int(len(ordered_df) * 0.8)

X_ordered = ordered_df[features]
y_ordered = ordered_df[target].astype(int)

evaluate_importance(
    "Ordered-ID Split",
    X_ordered.iloc[:split_index],
    X_ordered.iloc[split_index:],
    y_ordered.iloc[:split_index],
    y_ordered.iloc[split_index:],
)

print("\nFeature importance analysis completed!")
print("Results saved in reports/feature_importance/")
