import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function Dashboard({ setActivePage }) {
  const stats = [
    {
      label: "Dataset Records",
      value: "10,999",
      icon: Package,
    },
    {
      label: "Delayed Deliveries",
      value: "6,563",
      icon: AlertTriangle,
    },
    {
      label: "On-Time Deliveries",
      value: "4,436",
      icon: CheckCircle2,
    },
    {
      label: "ML Model",
      value: "Random Forest",
      icon: Truck,
    },
  ];

  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <div>
          <h2>Welcome to DeliveryAI</h2>
          <p>
            Explore historical shipment data and experiment
            with machine learning delivery predictions.
          </p>

          <button
            className="primary-btn"
            onClick={() => setActivePage("prediction")}
          >
            Start Prediction <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="section-heading">
        <h2>Dataset Overview</h2>
        <p>Summary of the historical e-commerce dataset</p>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon size={22} />
            </div>
            <span>{label}</span>
            <h3>{value}</h3>
          </div>
        ))}
      </div>

      <div className="info-panel">
        <h3>About This Project</h3>
        <p>
          DeliveryAI uses a Random Forest machine learning
          pipeline to estimate whether an e-commerce shipment
          may be delayed based on its order characteristics.
        </p>
        <p className="muted">
          Model predictions are experimental. Validation
          revealed limited generalization across different
          groups of records.
        </p>
      </div>
    </div>
  );
}
