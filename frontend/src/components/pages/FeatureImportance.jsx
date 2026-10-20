
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
  ReferenceLine,
} from "recharts";

export default function FeatureImportance() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/feature-importance")
      .then((res) => setData(res.data))
      .catch(() => setError("Unable to load feature importance."));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading feature importance...</p>;

  const chartData = data.random_split.map((item) => {
    const ordered = data.ordered_split.find(
      (row) => row.Feature === item.Feature
    );

    return {
      feature: item.Feature,
      random: Number(item.Importance),
      ordered: ordered ? Number(ordered.Importance) : 0,
    };
  });

  return (
    <section
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        marginTop: 24,
      }}
    >
      <h2 style={{ color: "#020915" }}>Feature Importance Analysis</h2>

      <p style={{ color: "#64748b" }}>
        Random Forest permutation importance measured as
        the decrease in ROC-AUC after shuffling each feature.
      </p>

      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 45, right: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="feature"
              type="category"
              width={155}
              tick={{ fontSize: 11 }}
            />
            <Tooltip formatter={(value) => Number(value).toFixed(4)} />
            <Legend />
            <ReferenceLine x={0} stroke="#64748b" />

            <Bar
              dataKey="random"
              name="Random Split"
              fill="#2563eb"
            />

            <Bar
              dataKey="ordered"
              name="Ordered-ID Split"
              fill="#f59e0b"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={{ color: "#64748b", lineHeight: 1.6 }}>
        Product weight had the strongest importance on the
        random split, but this did not generalize to the
        ordered-ID test. The ordered-ID model achieved a
        ROC-AUC of approximately 0.50, so feature rankings
        on that split should be interpreted cautiously.
      </p>
    </section>
  );
}
