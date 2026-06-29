import React, { useState, useEffect } from "react";
import { useToast } from "../../components/Toast";
import Modal from "../../components/Modal";
import SigForm from "./SigForm";
import SigDetail from "./SigDetail";
import { loadAdminSigs, saveAdminSigs, auditLog } from "../../lib/db";
import { Plus, Edit2, Trash2, ArrowRight, Compass } from "lucide-react";

export default function SigList() {
  const { success, error } = useToast();

  const [selectedSigForDetail, setSelectedSigForDetail] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSig, setEditingSig] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [sigs, setSigs] = React.useState<any[]>([]);

  useEffect(() => {
    setSigs(loadAdminSigs());
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleAdd = () => {
    setEditingSig(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sig: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening detail view
    setEditingSig(sig);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${name}?`)) return;
    const updated = loadAdminSigs().filter((s: any) => s._id !== id);
    saveAdminSigs(updated);
    auditLog("DELETE_SIG", "sigs", `Deleted SIG: ${name}`, "warning");
    success("SIG Deleted", `Successfully deleted ${name}.`);
    refresh();
  };

  if (selectedSigForDetail) {
    return <SigDetail sig={selectedSigForDetail} onBack={() => setSelectedSigForDetail(null)} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleAdd} className="btn btn-primary"><Plus size={16} /> Create SIG Category</button>
      </div>

      {sigs.length === 0 ? (
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-tertiary)" }}>No SIGs found. Create one to get started.</div>
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingSig ? "Edit SIG Details" : "Create New SIG"} maxWidth="500px">
        <SigForm
          sig={editingSig}
          onSuccess={() => {
            setIsFormOpen(false);
            success(editingSig ? "SIG Updated" : "SIG Created", `Successfully ${editingSig ? "updated" : "created"} SIG.`);
            refresh();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
