import React from "react";
import { useAuth } from "../hooks/useAuth";
import AdminLogin from "../AdminLogin";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-family)"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          animation: "spin 1s linear infinite",
          marginBottom: "16px"
        }} />
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
          Authenticating session...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
