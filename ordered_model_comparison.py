
from pathlib import Path
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)

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

# Sort by ID to simulate testing on later records.
# ID order is not verified to be chronological.
df = df.sort_values("ID").reset_index(drop=True)

X = df[features]
y = df[target].astype(int)

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

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
    "Majority Baseline": DummyClassifier(
        strategy="most_frequent"
    ),
}

results = []

print("TRAINING RECORDS:", len(X_train))
print("TEST RECORDS:", len(X_test))

print("\nTraining class distribution:")
print(y_train.value_counts(normalize=True))

print("\nTest class distribution:")
print(y_test.value_counts(normalize=True))

for name, classifier in models.items():
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", classifier),
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)[:, 1]

    row = {
        "Model": name,
        "Accuracy": round(
            accuracy_score(y_test, predictions), 4
        ),
        "Precision": round(
            precision_score(
                y_test, predictions, zero_division=0
            ), 4
        ),
        "Recall": round(
            recall_score(
                y_test, predictions, zero_division=0
            ), 4
        ),
        "F1": round(
            f1_score(
                y_test, predictions, zero_division=0
            ), 4
        ),
        "ROC_AUC": round(
            roc_auc_score(y_test, probabilities), 4
        ),
    }

    results.append(row)

    print(f"\n{'=' * 50}")
    print(name)
    print("=" * 50)

    print(classification_report(
        y_test,
        predictions,
        labels=[0, 1],
        target_names=["On Time", "Delayed"],
        zero_division=0,
    ))

    print("Confusion Matrix:")
    print(confusion_matrix(
        y_test, predictions, labels=[0, 1]
    ))

results_df = pd.DataFrame(results)

output_dir = BASE_DIR / "reports"
output_dir.mkdir(exist_ok=True)

output_path = output_dir / "ordered_model_comparison.csv"

results_df.to_csv(output_path, index=False)

print("\nORDERED-ID MODEL COMPARISON")
print(results_df.to_string(index=False))

print(f"\nSaved to: {output_path}")
