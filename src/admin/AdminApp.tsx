import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { loadMembers, loadEvents, loadAdminSigs, loadAuditLogs } from "./lib/db";

// Module Imports
import MemberList from "./modules/members/MemberList";
import EventList from "./modules/events/EventList";
import SigList from "./modules/sigs/SigList";
import LeadershipPanel from "./modules/leadership/LeadershipPanel";
import AuditLog from "./modules/audit/AuditLog";
import MemoryList from "./modules/gallery/MemoryList";
import ResourceList from "./modules/resources/ResourceList";

// Icons for Dashboard
import { Users, Calendar, Layers, Plus, ChevronRight } from "lucide-react";

export default function AdminApp() {
  const [currentTab, setTab] = useState("dashboard");
  const { user } = useAuth();

  // Dashboard stats from localStorage
  const [memberStats, setMemberStats] = useState({ total: 0, active: 0 });
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalSigs, setTotalSigs] = useState(0);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Load stats on mount and when switching back to dashboard
  useEffect(() => {
    if (currentTab === "dashboard") {
      const members = loadMembers();
      const events = loadEvents();
      const sigs = loadAdminSigs();
      const logs = loadAuditLogs();
      setMemberStats({
        total: members.length,
        active: members.filter((m: any) => m.status === "active").length,
      });
      setTotalEvents(events.length);
      setTotalSigs(sigs.length);
      setRecentLogs(logs.slice(0, 5));
    }
  }, [currentTab]);

  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return renderDashboard();
      case "members":
        return <MemberList />;
      case "events":
        return <EventList />;
      case "gallery":
        return <MemoryList />;
      case "sigs":
        return <SigList />;
      case "leadership":
        return <LeadershipPanel />;
      case "resources":
        return <ResourceList />;
      case "security":
        return <AuditLog />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-value">{memberStats.total}</span>
            <span className="stat-label">Total Registered</span>
          </div>
          <div className="stat-icon-wrapper">
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-value" style={{ color: "#34c759" }}>{memberStats.active}</span>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: "rgba(52, 199, 89, 0.1)", color: "#34c759" }}>
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-value">{totalEvents}</span>
            <span className="stat-label">Events Managed</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: "rgba(0, 113, 227, 0.1)", color: "var(--accent)" }}>
            <Calendar size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-value">{totalSigs}</span>
            <span className="stat-label">Active SIG Groups</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: "rgba(175, 82, 222, 0.1)", color: "#af52de" }}>
            <Layers size={20} />
          </div>
        </div>
      </div>

      {/* Dashboard Double Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", flexWrap: "wrap" }}>
        {/* Recent Audit/Activity Feed */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>System Activity Log</h3>
            <button className="btn-link" onClick={() => setTab("security")} style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentLogs.length === 0 ? (
              <div style={{ color: "var(--text-tertiary)", fontSize: "14px" }}>No recent log records.</div>
            ) : (
              recentLogs.map((log: any) => (
                <div key={log._id} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{log.action.replace(/_/g, " ")}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{log.details || `Modified ${log.resource}`}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span className={`log-severity ${log.severity}`}>{log.severity}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Quick Admin Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button onClick={() => setTab("members")} className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "12px" }}>
              <Plus size={16} /> Add New Club Member
            </button>
            <button onClick={() => setTab("events")} className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "12px" }}>
              <Plus size={16} /> Schedule Public Event
            </button>
            <button onClick={() => setTab("sigs")} className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "12px" }}>
              <Plus size={16} /> Manage SIG Categories
            </button>
            <button onClick={() => setTab("resources")} className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "12px" }}>
              <Plus size={16} /> Upload Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar currentTab={currentTab} setTab={setTab} />
      <main className="admin-main">
        <AdminHeader currentTab={currentTab} />
        <div className="admin-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
