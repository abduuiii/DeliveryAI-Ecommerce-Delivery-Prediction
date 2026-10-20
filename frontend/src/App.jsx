import Analytics from "./components/pages/Analytics";
import ModelInfo from "./components/pages/ModelInfo";
import { useState } from "react";

import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Dashboard from "./components/pages/Dashboard";
import Prediction from "./components/pages/Prediction";

import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const titles = {
    dashboard: "Dashboard",
    prediction: "Delivery Prediction",
    analytics: "Analytics",
    model: "Model Information",
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="main-layout">
        <Header title={titles[activePage]} />

        <main className="page-content">
          {activePage === "dashboard" && (
            <Dashboard setActivePage={setActivePage} />
          )}

          {activePage === "prediction" && <Prediction />}
          {activePage === "analytics" && <Analytics />}
          {activePage === "model" && <ModelInfo />} 
          
        </main>
      </div>
    </div>
  );
}