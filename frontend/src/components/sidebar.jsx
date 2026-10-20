import {
  LayoutDashboard,
  PackageSearch,
  BarChart3,
  BrainCircuit,
  Truck,
} from "lucide-react";

const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "prediction", label: "Predict Delivery", icon: PackageSearch },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "model", label: "Model Information", icon: BrainCircuit },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Truck size={28} />
        <span>DeliveryAI</span>
      </div>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {menu.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${
              activePage === id ? "active" : ""
            }`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        E-commerce Delivery Prediction
        <small>ML Capstone Project</small>
      </div>
    </aside>
  );
}