import React from "react";
import { 
  Users, 
  Calendar, 
  Layers, 
  ShieldAlert, 
  UserCheck, 
  LayoutDashboard, 
  LogOut, 
  User,
  Image
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export default function AdminSidebar({ currentTab, setTab }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, role: "editor" },
    { id: "members", label: "Members", icon: Users, role: "editor" },
    { id: "events", label: "Events", icon: Calendar, role: "editor" },
    { id: "gallery", label: "Gallery & Memories", icon: Image, role: "editor" },
    { id: "sigs", label: "SIGs", icon: Layers, role: "editor" },
    { id: "leadership", label: "Leadership", icon: UserCheck, role: "editor" },
    { id: "security", label: "Security & Logs", icon: ShieldAlert, role: "admin" }
  ];

  // Helper to check role permission
  const hasPermission = (itemRole: string) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    if (user.role === "admin" && itemRole !== "super_admin") return true;
    if (user.role === "editor" && itemRole === "editor") return true;
    return false;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo-icon">ACM</div>
        <div className="admin-logo-text">Admin Portal</div>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => {
          if (!hasPermission(item.role)) return null;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`admin-nav-item btn-link ${currentTab === item.id ? "active" : ""}`}
              style={{ textAlign: "left", width: "100%", border: "none", background: "none" }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        {user && (
          <div className="admin-user-profile">
            <div className="admin-avatar">
              {getInitials(user.name)}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{user.name}</span>
              <span className="admin-user-role">{user.role.replace("_", " ")}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={logout}
          className="admin-nav-item btn-link"
          style={{ 
            color: "#ff453a", 
            border: "none", 
            background: "none", 
            display: "flex", 
            alignItems: "center", 
            width: "100%",
            textAlign: "left"
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
