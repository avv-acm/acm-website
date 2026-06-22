import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import MemberForm from "./MemberForm";
import { Plus, Edit2, Trash2, Shield, UserCheck } from "lucide-react";

export default function MemberList() {
  const { token } = useAuth();
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

  // Queries
  const members = useQuery(
    api.members.listAdmin,
    token ? { token, status: statusFilter, department: deptFilter, search } : "skip"
  );
  
  const filteredMembers = React.useMemo(() => {
    if (!members) return [];
    if (typeFilter === "all") return members;
    return members.filter((m: any) => m.type === typeFilter);
  }, [members, typeFilter]);
  
  const stats = useQuery(api.members.getStats, token ? { token } : "skip");

  // Mutations
  const deleteMutation = useMutation(api.members.remove);
  const bulkDeleteMutation = useMutation(api.members.bulkDelete);
  const bulkStatusMutation = useMutation(api.members.bulkUpdateStatus);
  const configurePortalMutation = useMutation(api.student_portal.configurePortalAccess);

  const handleAdd = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMutation({ token: token!, id });
      success("Member Deleted", "The member record was successfully removed.");
    } catch (err: any) {
      error("Deletion Failed", err.message || "Could not delete member.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} members?`)) return;

    try {
      await bulkDeleteMutation({ token: token!, ids: selectedIds as any[] });
      success("Members Deleted", `Successfully deleted ${selectedIds.length} members.`);
      setSelectedIds([]);
    } catch (err: any) {
      error("Bulk Action Failed", err.message || "Failed to delete selected members.");
    }
  };

  const handleBulkStatusChange = async (status: "active" | "inactive" | "alumni" | "pending") => {
    if (selectedIds.length === 0) return;
    try {
      await bulkStatusMutation({ token: token!, ids: selectedIds as any[], status });
      success("Status Updated", `Updated status for ${selectedIds.length} members.`);
      setSelectedIds([]);
    } catch (err: any) {
      error("Bulk Action Failed", err.message || "Failed to update member status.");
    }
  };

  const handleOpenPortalConfig = (member: any) => {
    setPortalMember(member);
    setPortalEnabled(member.portalEnabled || false);
    setPortalPassword("");
    setIsPortalModalOpen(true);
  };

  const handleSavePortalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalMember) return;

    try {
      await configurePortalMutation({
        token: token!,
        memberId: portalMember._id,
        enabled: portalEnabled,
        password: portalPassword ? portalPassword : undefined,
      });
      success("Access Configured", `Successfully configured portal access for ${portalMember.name}`);
      setIsPortalModalOpen(false);
    } catch (err: any) {
      error("Configuration Failed", err.message || "Could not update portal access.");
    }
  };

  // Build unique department list for filter dropdown
  const departments = stats?.departments ? Object.keys(stats.departments) : [];

  const columns = [
    { key: "name", header: "Name", sortable: true },
    { key: "studentId", header: "Student ID/Roll No", sortable: true },
    { key: "email", header: "Email" },
    {
      key: "type",
      header: "Type",
      render: (row: any) => (
        <span className={`status-badge ${row.type === "faculty" ? "alumni" : "active"}`} style={{ textTransform: "capitalize" }}>
          {row.type || "student"}
        </span>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (row: any) => (
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {row.type === "faculty" 
            ? `${row.designation || "Faculty Advisor"} (${row.department})` 
            : `${row.year || "1st Year"} ${row.section ? `Sec ${row.section}` : ""}`}
        </span>
      ),
    },
    { key: "role", header: "Role" },
    {
      key: "status",
      header: "Status",
      render: (row: any) => (
        <span className={`status-badge ${row.status}`}>{row.status}</span>
      ),
    },
    {
      key: "portalEnabled",
      header: "Portal Access",
      render: (row: any) => (
        <span style={{ 
          fontSize: "11px", 
          fontWeight: 600, 
          color: row.portalEnabled ? "#34c759" : "var(--text-tertiary)",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
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
          <button
            onClick={() => handleEdit(row)}
            className="btn btn-secondary"
            style={{ padding: "6px", borderRadius: "8px" }}
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          {row.type !== "faculty" && (
            <button
              onClick={() => handleOpenPortalConfig(row)}
              className="btn btn-secondary"
              style={{ padding: "6px", borderRadius: "8px" }}
              title="Configure Student Portal Access"
            >
              <UserCheck size={14} />
            </button>
          )}
          <button
            onClick={() => handleDelete(row._id)}
            className="btn btn-secondary"
            style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Search & Filter Control Panel */}
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
            <select
              className="custom-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>

            <select
              className="custom-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="alumni">Alumni</option>
              <option value="pending">Pending</option>
            </select>

            <select
              className="custom-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <button onClick={handleAdd} className="btn btn-primary">
              <Plus size={16} /> Add Member
            </button>
          </div>
        </div>

        {/* Selected Rows Bulk Actions bar */}
        {selectedIds.length > 0 && (
          <div
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(var(--accent-rgb), 0.05)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600 }}>
              {selectedIds.length} members selected
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleBulkStatusChange("active")} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>
                Make Active
              </button>
              <button onClick={() => handleBulkStatusChange("inactive")} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>
                Make Inactive
              </button>
              <button onClick={() => handleBulkStatusChange("alumni")} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>
                Make Alumni
              </button>
              <button onClick={handleBulkDelete} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", color: "#ff453a", borderColor: "#ff453a" }}>
                Delete Selected
              </button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredMembers}
          loading={!members}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getRowId={(row: any) => row._id}
          pageSize={12}
        />
      </div>

      {/* Member Form Modal (Create / Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingMember ? "Edit Member Details" : "Add New Member"}
        maxWidth="600px"
      >
        <MemberForm
          member={editingMember}
          onSuccess={() => {
            setIsFormOpen(false);
            success(
              editingMember ? "Member Updated" : "Member Added",
              `Successfully ${editingMember ? "updated" : "created"} member profile.`
            );
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Portal Access Configuration Modal */}
      <Modal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        title="Student Portal Access Configuration"
      >
        {portalMember && (
          <form onSubmit={handleSavePortalConfig} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Configure student portal login for <strong>{portalMember.name}</strong> ({portalMember.studentId}).
            </div>

            <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="portalEnabledCheck"
                checked={portalEnabled}
                onChange={(e) => setPortalEnabled(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label htmlFor="portalEnabledCheck" className="form-label" style={{ cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                Enable Portal Access
              </label>
            </div>

            {portalEnabled && (
              <div className="form-group">
                <label className="form-label">Set Portal Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 8 characters (Leave empty to keep existing)"
                  value={portalPassword}
                  onChange={(e) => setPortalPassword(e.target.value)}
                  minLength={8}
                />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
              <button type="button" onClick={() => setIsPortalModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Settings
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
