import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import MemberForm from "./MemberForm";
import { loadMembers, saveMembers, auditLog } from "../../lib/db";
import { Plus, Edit2, Trash2, Shield, UserCheck } from "lucide-react";

export default function MemberList() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  // Portal access config modal state
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [portalMember, setPortalMember] = useState<any>(null);
  const [portalPassword, setPortalPassword] = useState("");
  const [portalEnabled, setPortalEnabled] = useState(false);

  // Local state for members — reloaded when form closes
  const [members, setMembers] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMembers(loadMembers());
  }, [refreshKey]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        (m.name || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.studentId || m.rollNo || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const matchesDept = deptFilter === "all" || m.department === deptFilter;
      const matchesType = typeFilter === "all" || m.type === typeFilter;
      return matchesSearch && matchesStatus && matchesDept && matchesType;
    });
  }, [members, search, statusFilter, deptFilter, typeFilter]);

  // Unique departments for filter
  const departments = useMemo(
    () => [...new Set(members.map((m) => m.department).filter(Boolean))],
    [members]
  );

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleAdd = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    const updated = loadMembers().filter((m) => m._id !== id);
    saveMembers(updated);
    auditLog("DELETE_MEMBER", "members", `Deleted member ${id}`, "warning");
    success("Member Deleted", "The member record was successfully removed.");
    refresh();
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} members?`)) return;
    const updated = loadMembers().filter((m) => !selectedIds.includes(m._id));
    saveMembers(updated);
    auditLog("BULK_DELETE_MEMBERS", "members", `Deleted ${selectedIds.length} members`, "warning");
    success("Members Deleted", `Successfully deleted ${selectedIds.length} members.`);
    setSelectedIds([]);
    refresh();
  };

  const handleBulkStatusChange = (status: "active" | "inactive" | "alumni" | "pending") => {
    if (selectedIds.length === 0) return;
    const all = loadMembers();
    const updated = all.map((m) =>
      selectedIds.includes(m._id) ? { ...m, status } : m
    );
    saveMembers(updated);
    auditLog("BULK_STATUS_UPDATE", "members", `Set ${selectedIds.length} members to ${status}`, "info");
    success("Status Updated", `Updated status for ${selectedIds.length} members.`);
    setSelectedIds([]);
    refresh();
  };

  const handleOpenPortalConfig = (member: any) => {
    setPortalMember(member);
    setPortalEnabled(member.portalEnabled || false);
    setPortalPassword("");
    setIsPortalModalOpen(true);
  };

  const handleSavePortalConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalMember) return;
    const all = loadMembers();
    const updated = all.map((m) =>
      m._id === portalMember._id
        ? { ...m, portalEnabled, portalPassword: portalPassword || m.portalPassword }
        : m
    );
    saveMembers(updated);
    auditLog("PORTAL_CONFIG", "members", `Configured portal access for ${portalMember.name}`, "info");
    success("Access Configured", `Portal access configured for ${portalMember.name}.`);
    setIsPortalModalOpen(false);
    refresh();
  };

  const columns = [
    { key: "name", header: "Name", sortable: true },
    { key: "studentId", header: "Student ID/Roll No", sortable: true, render: (row: any) => row.studentId || row.rollNo || "-" },
    { key: "email", header: "Email" },
    { key: "year", header: "Year", render: (row: any) => row.type === "student" ? (row.year || "1st Year") : "-" },
    { key: "department", header: "Department", render: (row: any) => row.department || "-" },
    {
      key: "type",
      header: "Type",
      render: (row: any) => (
        <span className={`status-badge ${row.type === "faculty" ? "alumni" : "active"}`} style={{ textTransform: "capitalize" }}>
          {row.type || "student"}
        </span>
      ),
    },
    { key: "role", header: "Role", render: (row: any) => row.role || "Member" },
    {
      key: "status",
      header: "Status",
      render: (row: any) => (
        <span className={`status-badge ${row.status || "active"}`}>{row.status || "active"}</span>
      ),
    },
    {
      key: "portalEnabled",
      header: "Portal Access",
      render: (row: any) => (
        <span style={{ fontSize: "11px", fontWeight: 600, color: row.portalEnabled ? "#34c759" : "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
          <Shield size={12} />
          {row.portalEnabled ? "Enabled" : "Disabled"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleEdit(row)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }} title="Edit">
            <Edit2 size={14} />
          </button>
          {row.type !== "faculty" && (
            <button onClick={() => handleOpenPortalConfig(row)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }} title="Configure Portal Access">
              <UserCheck size={14} />
            </button>
          )}
          <button onClick={() => handleDelete(row._id)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-panel">
        <div className="table-controls">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by name, email or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <select className="custom-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>

            <select className="custom-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="alumni">Alumni</option>
              <option value="pending">Pending</option>
            </select>

            <select className="custom-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="all">All Departments</option>
              {departments.map((dept: any) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <button onClick={handleAdd} className="btn btn-primary">
              <Plus size={16} /> Add Member
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div style={{ padding: "12px 24px", backgroundColor: "rgba(var(--accent-rgb), 0.05)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedIds.length} members selected</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleBulkStatusChange("active")} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>Make Active</button>
              <button onClick={() => handleBulkStatusChange("inactive")} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>Make Inactive</button>
              <button onClick={() => handleBulkStatusChange("alumni")} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>Make Alumni</button>
              <button onClick={handleBulkDelete} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", color: "#ff453a", borderColor: "#ff453a" }}>Delete Selected</button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredMembers}
          loading={false}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getRowId={(row: any) => row._id}
          pageSize={12}
        />
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingMember ? "Edit Member Details" : "Add New Member"} maxWidth="600px">
        <MemberForm
          member={editingMember}
          onSuccess={() => {
            setIsFormOpen(false);
            success(editingMember ? "Member Updated" : "Member Added", `Successfully ${editingMember ? "updated" : "created"} member profile.`);
            refresh();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal isOpen={isPortalModalOpen} onClose={() => setIsPortalModalOpen(false)} title="Student Portal Access Configuration">
        {portalMember && (
          <form onSubmit={handleSavePortalConfig} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Configure student portal login for <strong>{portalMember.name}</strong>.
            </div>
            <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" id="portalEnabledCheck" checked={portalEnabled} onChange={(e) => setPortalEnabled(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
              <label htmlFor="portalEnabledCheck" className="form-label" style={{ cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>Enable Portal Access</label>
            </div>
            {portalEnabled && (
              <div className="form-group">
                <label className="form-label">Set Portal Password</label>
                <input type="password" className="form-input" placeholder="Min 8 characters" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} minLength={8} />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
              <button type="button" onClick={() => setIsPortalModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Settings</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
