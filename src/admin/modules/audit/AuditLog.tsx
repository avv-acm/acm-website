import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import { loadAuditLogs, dbSave, auditLog } from "../../lib/db";
import { Trash2, ShieldAlert } from "lucide-react";

const AUDIT_KEY = "acm_audit_logs";

export default function AuditLog() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [severityFilter, setSeverityFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [retentionDays, setRetentionDays] = useState(30);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    setLogs(loadAuditLogs());
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
      const matchResource = resourceFilter === "all" || log.resource === resourceFilter;
      return matchSeverity && matchResource;
    });
  }, [logs, severityFilter, resourceFilter]);

  const handleCleanup = () => {
    if (user?.role !== "super_admin") {
      error("Unauthorized", "Only super administrators can purge security logs.");
      return;
    }
    if (!window.confirm(`Delete all audit logs older than ${retentionDays} days? This cannot be undone.`)) return;

    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    const kept = logs.filter((log) => new Date(log.timestamp).getTime() >= cutoff);
    const removed = logs.length - kept.length;
    dbSave(AUDIT_KEY, kept);
    setLogs(kept);
    auditLog("PURGE_LOGS", "audit_logs", `Purged ${removed} log entries older than ${retentionDays} days`, "warning");
    success("Logs Cleaned", `Successfully purged ${removed} historical log entries.`);
  };

  const columns = [
    { key: "timestamp", header: "Timestamp", sortable: true, render: (row: any) => new Date(row.timestamp).toLocaleString() },
    { key: "action", header: "Action", sortable: true, render: (row: any) => (
      <code style={{ fontSize: "12px", background: "var(--bg-elevated)", padding: "2px 6px", borderRadius: "4px" }}>{row.action}</code>
    )},
    { key: "resource", header: "Resource", sortable: true },
    { key: "details", header: "Details", render: (row: any) => <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{row.details || "-"}</span> },
    { key: "severity", header: "Severity", render: (row: any) => <span className={`log-severity ${row.severity}`}>{row.severity}</span> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {user?.role === "super_admin" && (
        <div className="glass-panel" style={{ padding: "20px 24px", background: "rgba(255, 69, 58, 0.03)", borderColor: "rgba(255, 69, 58, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ShieldAlert size={20} color="#ff453a" />
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 700 }}>Log Retention & Cleanup</h4>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Purge historical logs to free up local storage. This operation is permanent.</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px" }}>Older than:</span>
            <select className="custom-select" value={retentionDays} onChange={(e) => setRetentionDays(Number(e.target.value))} style={{ padding: "6px 12px" }}>
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

      <div className="glass-panel">
        <div className="table-controls">
          <div className="filter-actions" style={{ width: "100%", justifyContent: "flex-start", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Severity:</span>
              <select className="custom-select" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Resource:</span>
              <select className="custom-select" value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)}>
                <option value="all">All Resources</option>
                <option value="members">Members</option>
                <option value="events">Events</option>
                <option value="sigs">SIGs</option>
                <option value="audit_logs">Audit Logs</option>
              </select>
            </div>
          </div>
        </div>
        <DataTable columns={columns} data={filteredLogs} loading={false} getRowId={(row: any) => row._id} pageSize={15} />
      </div>
    </div>
  );
}
