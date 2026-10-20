
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

BASE_DIR = Path(__file__).resolve().parent
df = pd.read_csv(BASE_DIR / "datasets" / "E_Commerce.csv")

output_dir = BASE_DIR / "reports" / "eda"
output_dir.mkdir(parents=True, exist_ok=True)

target = "Reached.on.Time_Y.N"

sns.set_theme(style="whitegrid")

# 1. Target distribution
plt.figure(figsize=(7, 5))
sns.countplot(
    data=df,
    x=target,
    order=[0, 1]
)
plt.xticks([0, 1], ["On Time", "Delayed"])
plt.title("Delivery Status Distribution")
plt.xlabel("Delivery Status")
plt.ylabel("Number of Orders")
plt.tight_layout()
plt.savefig(output_dir / "delivery_distribution.png", dpi=200)
plt.close()

# 2. Delay rate by shipment mode
mode_delay = (
    df.groupby("Mode_of_Shipment")[target]
    .mean()
    .mul(100)
    .sort_values(ascending=False)
)

plt.figure(figsize=(8, 5))
sns.barplot(
    x=mode_delay.index,
    y=mode_delay.values
)
plt.title("Delay Rate by Shipment Mode")
plt.xlabel("Shipment Mode")
plt.ylabel("Delay Rate (%)")
plt.ylim(0, 100)
plt.tight_layout()
plt.savefig(output_dir / "shipment_delay.png", dpi=200)
plt.close()

# 3. Delay rate by warehouse
warehouse_delay = (
    df.groupby("Warehouse_block")[target]
    .mean()
    .mul(100)
    .sort_values(ascending=False)
)

plt.figure(figsize=(8, 5))
sns.barplot(
    x=warehouse_delay.index,
    y=warehouse_delay.values
)
plt.title("Delay Rate by Warehouse")
plt.xlabel("Warehouse")
plt.ylabel("Delay Rate (%)")
plt.ylim(0, 100)
plt.tight_layout()
plt.savefig(output_dir / "warehouse_delay.png", dpi=200)
plt.close()

# 4. Product weight vs delivery status
plt.figure(figsize=(8, 5))
sns.boxplot(
    data=df,
    x=target,
    y="Weight_in_gms",
    order=[0, 1]
)
plt.xticks([0, 1], ["On Time", "Delayed"])
plt.title("Product Weight vs Delivery Status")
plt.xlabel("Delivery Status")
plt.ylabel("Product Weight (grams)")
plt.tight_layout()
plt.savefig(output_dir / "weight_analysis.png", dpi=200)
plt.close()

# 5. Discount vs delivery status
plt.figure(figsize=(8, 5))
sns.boxplot(
    data=df,
    x=target,
    y="Discount_offered",
    order=[0, 1]
)
plt.xticks([0, 1], ["On Time", "Delayed"])
plt.title("Discount vs Delivery Status")
plt.xlabel("Delivery Status")
plt.ylabel("Discount Offered")
plt.tight_layout()
plt.savefig(output_dir / "discount_analysis.png", dpi=200)
plt.close()

# 6. Correlation heatmap
numeric_df = df.select_dtypes(include="number").drop(
    columns=["ID"], errors="ignore"
)

plt.figure(figsize=(10, 7))
sns.heatmap(
    numeric_df.corr(),
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)
plt.title("Numerical Feature Correlation")
plt.tight_layout()
plt.savefig(output_dir / "correlation_heatmap.png", dpi=200)
plt.close()

# 7. Data quality report
quality = pd.DataFrame({
    "Missing Values": df.isna().sum(),
    "Missing %": df.isna().mean().mul(100).round(2),
    "Unique Values": df.nunique(),
})

quality.to_csv(output_dir / "data_quality.csv")

print("Dataset shape:", df.shape)
print("Duplicate rows:", df.duplicated().sum())
print("Delay rate:", round(df[target].mean() * 100, 2), "%")
print("\nData quality:\n", quality)
print("\nEDA charts saved to:", output_dir)
