
import pandas as pd
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix,
)

# Dataset
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

X = df[features]
y = df[target]

categorical = [
    "Warehouse_block",
    "Mode_of_Shipment",
    "Product_importance",
    "Gender",
]

numerical = [col for col in features if col not in categorical]

# Preprocessing
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore")),
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, numerical),
    ("cat", categorical_pipeline, categorical),
])

# Random split for an initial comparison
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
    ),
    "Decision Tree": DecisionTreeClassifier(
        random_state=42,
    ),
    "Logistic Regression": LogisticRegression(
        max_iter=1000,
        random_state=42,
    ),
    "KNN": KNeighborsClassifier(n_neighbors=5),
}

results = []

for name, classifier in models.items():
    print(f"\n{'=' * 50}")
    print(f"Training: {name}")
    print("=" * 50)

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", classifier),
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)[:, 1]

    metrics = {
        "Model": name,
        "Accuracy": round(accuracy_score(y_test, predictions), 4),
        "Precision": round(
            precision_score(y_test, predictions, zero_division=0), 4
        ),
        "Recall": round(
            recall_score(y_test, predictions, zero_division=0), 4
        ),
        "F1": round(
            f1_score(y_test, predictions, zero_division=0), 4
        ),
        "ROC_AUC": round(
            roc_auc_score(y_test, probabilities), 4
        ),
    }

    results.append(metrics)

    print("\nClassification Report:")
    print(classification_report(
        y_test,
        predictions,
        target_names=["On Time", "Delayed"],
        zero_division=0,
    ))

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, predictions))

# Save results
results_df = pd.DataFrame(results)

output_dir = BASE_DIR / "reports"
output_dir.mkdir(exist_ok=True)

results_df.to_csv(
    output_dir / "model_comparison.csv",
    index=False,
)

print("\nMODEL COMPARISON RESULTS")
print(results_df.to_string(index=False))

print("\nSaved to reports/model_comparison.csv")
