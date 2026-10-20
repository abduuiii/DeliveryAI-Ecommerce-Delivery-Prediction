import { useState } from "react";
import axios from "axios";
import {
  PackageSearch,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/predict";

export default function Prediction() {
  const [form, setForm] = useState({
    Warehouse_block: "A",
    Mode_of_Shipment: "Ship",
    Cost_of_the_Product: 200,
    Prior_purchases: 3,
    Product_importance: "medium",
    Gender: "M",
    Discount_offered: 10,
    Weight_in_gms: 2500,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "number" ? Number(value) : value,
    }));

    setResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(API_URL, form, {
        timeout: 10000,
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to connect to Flask. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="section-heading">
        <h2>Delivery Prediction</h2>
        <p>Enter order details to estimate delivery delay risk.</p>
      </div>

      <div className="prediction-card">
        <div className="prediction-card-title">
          <PackageSearch size={24} />
          <h3>Shipment Information</h3>
        </div>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-field">
            <label>Warehouse Block</label>
            <select
              name="Warehouse_block"
              value={form.Warehouse_block}
              onChange={handleChange}
            >
              {["A", "B", "C", "D", "F"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Mode of Shipment</label>
            <select
              name="Mode_of_Shipment"
              value={form.Mode_of_Shipment}
              onChange={handleChange}
            >
              {["Ship", "Flight", "Road"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Product Cost</label>
            <input
              type="number"
              name="Cost_of_the_Product"
              min="0"
              step="any"
              required
              value={form.Cost_of_the_Product}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Prior Purchases</label>
            <input
              type="number"
              name="Prior_purchases"
              min="0"
              step="1"
              required
              value={form.Prior_purchases}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Product Importance</label>
            <select
              name="Product_importance"
              value={form.Product_importance}
              onChange={handleChange}
            >
              {["low", "medium", "high"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Customer Gender</label>
            <select
              name="Gender"
              value={form.Gender}
              onChange={handleChange}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div className="form-field">
            <label>Discount Offered</label>
            <input
              type="number"
              name="Discount_offered"
              min="0"
              step="any"
              required
              value={form.Discount_offered}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Product Weight (grams)</label>
            <input
              type="number"
              name="Weight_in_gms"
              min="1"
              step="any"
              required
              value={form.Weight_in_gms}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="submit-prediction"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Predicting...
              </>
            ) : (
              <>
                <PackageSearch size={18} />
                Predict Delivery
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="prediction-error">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="prediction-result">
          <div className="prediction-card-title">
            <h3>Prediction Result</h3>
          </div>

          <div
            className={`prediction-status ${
              result.prediction === 1 ? "is-delayed" : "is-ontime"
            }`}
          >
            {result.prediction === 1 ? (
              <AlertTriangle size={28} />
            ) : (
              <CheckCircle2 size={28} />
            )}

            <span>
              {result.prediction === 1
                ? "Delayed Delivery"
                : "On-Time Delivery"}
            </span>
          </div>

          <div className="probability-grid">
            <div className="probability-card">
              <span>Delay Probability</span>
              <strong>{result.delay_probability}%</strong>
            </div>

            <div className="probability-card">
              <span>On-Time Probability</span>
              <strong>{result.on_time_probability}%</strong>
            </div>
          </div>

          <p className="prediction-note">
            Experimental prediction only. The model has shown
            limited generalization and these percentages should
            not be treated as calibrated real-world probabilities.
          </p>
        </div>
      )}
    </div>
  );
}