# DeliveryAI – E-commerce Product Delivery Prediction

## Project Overview

DeliveryAI is an end-to-end machine learning application designed to analyze e-commerce delivery patterns and predict whether an order will be delivered on time or delayed.

The project combines machine learning classification, exploratory data analysis, a Flask REST API, and an interactive React dashboard.

## Objectives

- Explore delivery patterns and customer-related factors.
- Develop and compare classification models.
- Identify features associated with delivery predictions.
- Evaluate model performance using multiple validation strategies.
- Build an interactive interface for delivery predictions and analytics.

## Technologies Used

**Machine Learning:** Python, Pandas, NumPy, Scikit-learn

**Visualization:** Matplotlib, Seaborn, Recharts

**Backend:** Flask, Flask-CORS

**Frontend:** React, Vite, Axios

## Dataset

The project uses an e-commerce shipping dataset containing **10,999 records and 12 columns**.

The target variable is `Reached.on.Time_Y.N`, where:

- `0` = On Time
- `1` = Delayed

The dataset contains no missing values or duplicate rows.

The overall delayed-delivery rate is approximately **59.67%**.

## Machine Learning Models

Four classification algorithms were evaluated:

1. Random Forest
2. Decision Tree
3. Logistic Regression
4. K-Nearest Neighbors (KNN)

The preprocessing pipeline includes categorical encoding, missing-value imputation, and numerical scaling.

## Model Performance

### Random Train-Test Split

| Model | Accuracy | ROC-AUC |
|---|---:|---:|
| Random Forest | 66.32% | 0.7368 |
| Decision Tree | 63.95% | 0.6267 |
| Logistic Regression | 63.41% | 0.7194 |
| KNN | 64.55% | 0.7065 |

### Ordered-ID Evaluation

| Model | Accuracy | ROC-AUC |
|---|---:|---:|
| Random Forest | 51.14% | 0.5000 |
| Decision Tree | 53.68% | 0.5302 |
| Logistic Regression | 48.73% | 0.4984 |
| KNN | 51.55% | 0.5119 |

Random Forest achieved the best random-split performance, but the ordered-ID evaluation revealed weak generalization.

The ID column has not been verified as chronological, so the ordered-ID evaluation should be interpreted as a robustness test rather than a true time-based validation.

## Feature Importance

Permutation importance was evaluated on both splits.

Product weight and discount offered had the strongest measured importance on the random split. However, product weight did not retain its importance on the ordered-ID evaluation.

These results describe model behavior and do not establish causal relationships.

## Application Features

- Interactive delivery prediction form
- Delivery analytics dashboard
- Shipment mode and warehouse analysis
- Model information and performance metrics
- Algorithm comparison visualizations
- Feature importance comparison

## Project Structure

```text
Ecommerce_Delivery_Prediction/
├── backend/
│   └── apk.py
├── datasets/
│   └── E_Commerce.csv
├── frontend/
│   ├── src/
│   └── package.json
├── models/
│   └── delivery_model.pkl
├── reports/
│   ├── eda/
│   ├── feature_importance/
│   ├── model_comparison.csv
│   └── ordered_model_comparison.csv
├── advanced_eda.py
├── feature_importance.py
├── model_comparison.py
├── ordered_model_comparison.py
├── requirements.txt
└── README.md
```

## Installation and Setup

### Backend

Create and activate a Python virtual environment:

```powershell
python -m venv ecommerce_env
.\ecommerce_env\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

Start Flask:

```powershell
python backend/apk.py
```

The backend runs at `http://127.0.0.1:5000`.

### Frontend

Open a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The application expects the trained model artifact at `models/delivery_model.pkl`.

## Limitations

The project is an experimental machine learning prototype.

Model performance declined substantially in the ordered-ID evaluation. Predicted probabilities have not been verified as calibrated, and the current results do not establish reliable real-world delivery forecasting.

Future improvements include richer delivery-related data, verified chronological validation, model calibration, and deployment monitoring.

## Conclusion

DeliveryAI demonstrates a complete machine learning workflow, from data exploration and preprocessing to model evaluation, visualization, backend integration, and frontend development.

The project also highlights the importance of testing model generalization rather than relying on a single random train-test split.
