import FeatureImportance from "./FeatureImportance";
import ModelComparison from "./ModelComparison";
import "./ModelInfo.css";

const features = [
  ["Warehouse Block", "Warehouse A, B, C, D or F"],
  ["Shipment Mode", "Ship, Flight or Road"],
  ["Product Cost", "Cost of the product"],
  ["Prior Purchases", "Number of previous purchases"],
  ["Product Importance", "Low, Medium or High"],
  ["Gender", "Customer gender"],
  ["Discount Offered", "Discount on the order"],
  ["Product Weight", "Weight in grams"],
];

const workflow = [
  {
    number: "01",
    title: "Dataset",
    description: "10,999 historical e-commerce delivery records",
  },
  {
    number: "02",
    title: "Preprocessing",
    description: "Missing value imputation, scaling and one-hot encoding",
  },
  {
    number: "03",
    title: "Model Training",
    description: "Random Forest classification using scikit-learn",
  },
  {
    number: "04",
    title: "Prediction",
    description: "Predict delayed or on-time delivery",
  },
];

export default function ModelInfo() {
  return (
    <div className="model-page">
      <div className="model-heading">
        <h2>Model Information</h2>
        <p>Architecture, features and evaluation of the ML model</p>
        <ModelComparison />
        <FeatureImportance />
      </div>

      <div className="model-hero">
        <div className="model-hero-icon">🧠</div>
        <div>
          <span className="model-eyebrow">MACHINE LEARNING MODEL</span>
          <h2>Random Forest Classifier</h2>
          <p>
            A supervised classification model that estimates whether
            an e-commerce shipment will be delayed or delivered on time.
          </p>
          <span className="model-status">Experimental Model</span>
        </div>
      </div>

      <div className="model-details">
        <div className="model-detail-card">
          <span>Algorithm</span>
          <strong>Random Forest</strong>
        </div>

        <div className="model-detail-card">
          <span>Problem Type</span>
          <strong>Binary Classification</strong>
        </div>

        <div className="model-detail-card">
          <span>Training Library</span>
          <strong>Scikit-learn</strong>
        </div>

        <div className="model-detail-card">
          <span>Input Features</span>
          <strong>8 Features</strong>
        </div>
      </div>

      <div className="model-section">
        <h3>Machine Learning Workflow</h3>

        <div className="model-workflow">
          {workflow.map((step, index) => (
            <div className="model-workflow-item" key={step.number}>
              <div className="model-workflow-card">
                <span>{step.number}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>

              {index < workflow.length - 1 && (
                <div className="model-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="model-section">
        <h3>Input Features</h3>
        <p className="model-section-description">
          These eight inputs are used to generate a delivery prediction.
        </p>

        <div className="model-features">
          {features.map(([name, description], index) => (
            <div className="model-feature" key={name}>
              <div className="model-feature-number">{index + 1}</div>
              <div>
                <strong>{name}</strong>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="model-section">
        <h3>Prediction Classes</h3>

        <div className="model-classes">
          <div className="model-class on-time">
            <span>Class 0</span>
            <h4>On-Time Delivery</h4>
            <p>Model predicts the order will arrive on time.</p>
          </div>

          <div className="model-class delayed">
            <span>Class 1</span>
            <h4>Delayed Delivery</h4>
            <p>Model predicts the order will be delayed.</p>
          </div>
        </div>
      </div>

      <div className="model-section">
        <h3>Model Evaluation</h3>
        <p className="model-section-description">
          Performance depends on the evaluation method and the
          portion of the dataset used.
        </p>

        <div className="model-evaluation">
          <div>
            <span>Random-split accuracy</span>
            <strong>Approximately 66%</strong>
          </div>

          <div>
            <span>Ordered-ID holdout accuracy</span>
            <strong>Approximately 51%</strong>
          </div>
        </div>

        <p className="model-note">
          These results come from different evaluation setups and
          should not be interpreted as interchangeable measures.
          Performance on later records is substantially weaker.
        </p>
      </div>

      <div className="model-warning">
        <strong>Important Model Limitation</strong>
        <p>
          This is an experimental academic model. Evaluation on
          later portions of the dataset indicates weak generalization.
          Predicted probabilities are not calibrated or verified as
          reliable real-world delivery risk estimates.
        </p>
      </div>
    </div>
  );
}
