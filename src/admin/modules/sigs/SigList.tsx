import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import Modal from "../../components/Modal";
import SigForm from "./SigForm";
import SigDetail from "./SigDetail";
import { Plus, Edit2, Trash2, ArrowRight, Compass } from "lucide-react";

export default function SigList() {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [selectedSigForDetail, setSelectedSigForDetail] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSig, setEditingSig] = useState<any>(null);

  // Queries
  const sigs = useQuery(api.sigs.listAdmin, token ? { token } : "skip");

  // Mutations
  const deleteMutation = useMutation(api.sigs.remove);

  const handleAdd = () => {
    setEditingSig(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sig: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening detail view
    setEditingSig(sig);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: any, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening detail view
    if (!window.confirm(`Are you sure you want to delete ${name}? All associated committee and faculty records will be deleted.`)) return;

    try {
      await deleteMutation({ token: token!, id });
      success("SIG Deleted", `Successfully deleted ${name}.`);
    } catch (err: any) {
      error("Deletion Failed", err.message || "Could not delete Special Interest Group.");
    }
  };

  // If a SIG is selected, show detail view
  if (selectedSigForDetail) {
    return (
      <SigDetail
        sig={selectedSigForDetail}
        onBack={() => setSelectedSigForDetail(null)}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={16} /> Create SIG Category
        </button>
      </div>

      {!sigs ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton animate-pulse" style={{ height: "240px", borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : sigs.length === 0 ? (
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-tertiary)" }}>
          No Special Interest Groups found. Create one to get started.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {sigs.map((sig) => (
            <div
              key={sig._id}
              onClick={() => setSelectedSigForDetail(sig)}
              className="apple-card"
              style={{ minHeight: "260px", padding: "28px" }}
            >
              <div className="card-top">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="card-icon">
                    <Compass size={20} />
                  </div>
                  <span className={`status-badge ${sig.status}`}>{sig.status}</span>
                </div>
                
                <h3 className="card-title" style={{ marginTop: "12px" }}>{sig.name}</h3>
                <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>
                  Focus: {sig.focusArea}
                </span>
                
                <p className="card-desc" style={{ 
                  marginTop: "8px", 
                  fontSize: "13px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {sig.description}
                </p>
              </div>

              <div className="card-bottom" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "20px" }}>
                <span className="card-tag">{sig.membersCount} Members</span>
                
                <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleEdit(sig, e)}
                    className="btn btn-secondary"
                    style={{ padding: "6px", borderRadius: "8px" }}
                    title="Edit SIG details"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(sig._id, sig.name, e)}
                    className="btn btn-secondary"
                    style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}
                    title="Delete SIG"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingSig ? "Edit SIG Details" : "Create New SIG"}
        maxWidth="500px"
      >
        <SigForm
          sig={editingSig}
          onSuccess={() => {
            setIsFormOpen(false);
            success(
              editingSig ? "SIG Updated" : "SIG Created",
              `Successfully ${editingSig ? "updated" : "created"} SIG category.`
            );
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
