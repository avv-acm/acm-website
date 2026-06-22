import React from "react";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  currentTab: string;
}

export default function AdminHeader({ currentTab }: HeaderProps) {
  const { user } = useAuth();

  const getTitle = () => {
    switch (currentTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "members":
        return "Member Management";
      case "events":
        return "Events Manager";
      case "sigs":
        return "Special Interest Groups (SIGs)";
      case "leadership":
        return "Core Leadership & Advisors";
      case "security":
        return "Security & System Logs";
      default:
        return "Admin Control Panel";
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <header className="admin-header">
      <div>
        <h1 className="admin-header-title">{getTitle()}</h1>
        <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
          {getTodayDate()}
        </div>
      </div>

      <div className="admin-header-actions">
        {user && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {user.name}
            </span>
            <span style={{ fontSize: "11px", color: "var(--accent)" }}>
              {user.role.replace("_", " ").toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
