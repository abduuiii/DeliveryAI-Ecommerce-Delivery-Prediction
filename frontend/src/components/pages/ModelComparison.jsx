
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./ModelComparison.css";

const API = "http://127.0.0.1:5000/model-comparison";

const percent = (value) =>
  `${(Number(value) * 100).toFixed(2)}%`;

export default function ModelComparison() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(API)
      .then((response) => setResults(response.data))
      .catch(() => setError("Unable to load model results."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading model comparison...</p>;
  if (error) return <p>{error}</p>;
  if (!results) return null;

  const random = results.random_split;
  const ordered = results.ordered_split;

  const comparison = random.map((model) => {
    const match = ordered.find(
      (item) => item.Model === model.Model
    );

    return {
      name: model.Model,
      random: Number((model.Accuracy * 100).toFixed(2)),
      ordered: match
        ? Number((match.Accuracy * 100).toFixed(2))
        : null,
    };
  });

  return (
    <div className="comparison-page">
      <div className="comparison-heading">
        <h2>ML Model Comparison</h2>
        <p>
          Evaluation of classification algorithms using
          random and ordered-ID splits.
        </p>
      </div>

      <div className="comparison-chart">
        <h3>Accuracy Comparison</h3>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />

            <Bar
              dataKey="random"
              name="Random Split"
              fill="#2563eb"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="ordered"
              name="Ordered-ID Split"
              fill="#f59e0b"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="comparison-table-wrapper">
        <h3>Random Split Results</h3>

        <table className="comparison-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Precision</th>
              <th>Recall</th>
              <th>F1</th>
              <th>ROC-AUC</th>
            </tr>
          </thead>

          <tbody>
            {random.map((model) => (
              <tr key={model.Model}>
                <td>{model.Model}</td>
                <td>{percent(model.Accuracy)}</td>
                <td>{percent(model.Precision)}</td>
                <td>{percent(model.Recall)}</td>
                <td>{percent(model.F1)}</td>
                <td>{model.ROC_AUC.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-table-wrapper">
        <h3>Ordered-ID Split Results</h3>

        <table className="comparison-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Precision</th>
              <th>Recall</th>
              <th>F1</th>
              <th>ROC-AUC</th>
            </tr>
          </thead>

          <tbody>
            {ordered.map((model) => (
              <tr key={model.Model}>
                <td>{model.Model}</td>
                <td>{percent(model.Accuracy)}</td>
                <td>{percent(model.Precision)}</td>
                <td>{percent(model.Recall)}</td>
                <td>{percent(model.F1)}</td>
                <td>{Number(model.ROC_AUC).toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-note">
        <strong>Model Evaluation Insight</strong>
        <p>
          Random Forest achieved the highest random-split
          accuracy, but its performance dropped on the
          ordered-ID test. The dataset shows distribution
          shift, so these models should be considered
          experimental rather than production-ready.
        </p>
        <p>
          ID ordering is not verified to represent time.
          The ordered-ID split is a robustness test,
          not a confirmed future-delivery evaluation.
        </p>
      </div>
    </div>
  );
}
