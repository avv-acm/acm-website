import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import { Trash2, ShieldAlert } from "lucide-react";

export default function AuditLog() {
  const { token, user } = useAuth();
  const { success, error } = useToast();

  const [severityFilter, setSeverityFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [retentionDays, setRetentionDays] = useState(30);

  // Queries
  const logs = useQuery(
    api.audit.listLogs,
    token ? { token, severity: severityFilter, resource: resourceFilter } : "skip"
  );

  // Mutations
  const cleanupMutation = useMutation(api.audit.cleanupOldLogs);

  const handleCleanup = async () => {
    if (user?.role !== "super_admin") {
      error("Unauthorized", "Only super administrators can purge security logs.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete all audit logs older than ${retentionDays} days? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await cleanupMutation({ token: token!, retentionDays });
      success("Logs Cleaned", `Successfully purged ${result.count} historical log entries.`);
    } catch (err: any) {
      error("Action Failed", err.message || "Failed to purge historical logs.");
    }
  };

  const columns = [
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (row: any) => new Date(row.timestamp).toLocaleString(),
    },
    {
      key: "userName",
      header: "Admin User",
      render: (row: any) => row.userName || "System",
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (row: any) => (
        <code style={{ fontSize: "12px", background: "var(--bg-elevated)", padding: "2px 6px", borderRadius: "4px" }}>
          {row.action}
        </code>
      ),
    },
    { key: "resource", header: "Resource Type", sortable: true },
    {
      key: "details",
      header: "Details",
      render: (row: any) => (
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{row.details || "-"}</span>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (row: any) => (
        <span className={`log-severity ${row.severity}`}>{row.severity}</span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Retention/Purge Control Banner (Only Super Admin) */}
      {user?.role === "super_admin" && (
        <div 
          className="glass-panel"
          style={{ 
            padding: "20px 24px", 
            background: "rgba(255, 69, 58, 0.03)", 
            borderColor: "rgba(255, 69, 58, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ShieldAlert size={20} color="#ff453a" />
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 700 }}>Log Retention & Cleanup</h4>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Purge historical logs to optimize database storage. This operation is permanent.
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px" }}>Older than:</span>
            <select
              className="custom-select"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              style={{ padding: "6px 12px" }}
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
            </select>
            <button onClick={handleCleanup} className="btn btn-secondary" style={{ padding: "6px 14px", color: "#ff453a", borderColor: "#ff453a", display: "flex", gap: "6px" }}>
              <Trash2 size={14} /> Purge Logs
            </button>
          </div>
        </div>
      )}

      {/* Main Filter & Data Table */}
      <div className="glass-panel">
        <div className="table-controls">
          <div className="filter-actions" style={{ width: "100%", justifyContent: "flex-start", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Severity:</span>
              <select
                className="custom-select"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Resource:</span>
              <select
                className="custom-select"
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
              >
                <option value="all">All Resources</option>
                <option value="admin_auth">Authentication</option>
                <option value="members">Members</option>
                <option value="events">Events</option>
                <option value="sigs">SIGs</option>
                <option value="sig_committee">SIG Committee</option>
                <option value="sig_faculty">SIG Faculty</option>
                <option value="core_committee">Core Committee</option>
                <option value="faculty_advisors">Faculty Advisors</option>
                <option value="audit_logs">Audit / System logs</option>
              </select>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={logs ?? []}
          loading={!logs}
          getRowId={(row: any) => row._id}
          pageSize={15}
        />
      </div>
    </div>
  );
}
