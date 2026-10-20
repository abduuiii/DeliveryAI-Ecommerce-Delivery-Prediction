
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://127.0.0.1:5000/analytics";
const COLORS = ["#ef4444", "#22c55e"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setData(response.data))
      .catch(() => setError("Failed to load analytics data. Check Flask."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="analytics-message">Loading analytics...</div>;
  }

  if (error) {
    return <div className="analytics-message">{error}</div>;
  }

  if (!data) return null;

  const stats = [
    {
      label: "Total Orders",
      value: data.summary.total_orders.toLocaleString(),
      color: "#2563eb",
    },
    {
      label: "Delayed Orders",
      value: data.summary.delayed.toLocaleString(),
      color: "#ef4444",
    },
    {
      label: "On-Time Orders",
      value: data.summary.on_time.toLocaleString(),
      color: "#16a34a",
    },
    {
      label: "Delay Rate",
      value: `${data.summary.delay_rate}%`,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-heading">
        <h2>Delivery Analytics</h2>
        <p>Historical delivery insights from the e-commerce dataset</p>
      </div>

      {/* Summary cards */}
      <div className="analytics-stats">
        {stats.map((stat) => (
          <div className="analytics-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <h3 style={{ color: stat.color }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        <div className="analytics-chart-card">
          <h3>Delivery Status Distribution</h3>
          <div className="analytics-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.delivery_distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  label
                >
                  {data.delivery_distribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card">
          <h3>Shipment Mode Delay Rate</h3>
          <div className="analytics-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.shipment_modes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar
                  dataKey="delay_rate"
                  name="Delay Rate"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card">
          <h3>Warehouse Delay Rate</h3>
          <div className="analytics-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.warehouses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar
                  dataKey="delay_rate"
                  name="Delay Rate"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <p className="analytics-disclaimer">
        Analytics are based on historical dataset records.
        Delay rates are descriptive statistics, not live shipment data.
      </p>
    </div>
  );
}
