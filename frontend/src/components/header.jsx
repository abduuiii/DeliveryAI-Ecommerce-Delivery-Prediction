import { Bell, CircleUserRound } from "lucide-react";

export default function Header({ title }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>Machine Learning Delivery Intelligence Platform</p>
      </div>

      <div className="header-profile">
        <CircleUserRound size={27} />
        <span>Admin</span>
      </div>
    </header>
  );
}