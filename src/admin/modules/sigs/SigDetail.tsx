import React, { useState, useEffect } from "react";
import { useToast } from "../../components/Toast";
import Modal from "../../components/Modal";
import PersonForm from "./PersonForm";
import { dbLoad, dbSave, genId, auditLog } from "../../lib/db";
import { ArrowLeft, Plus, Edit2, Trash2, User, ArrowUp, ArrowDown } from "lucide-react";

// People stored per-sig: acm_sig_people_<sigId>
function sigPeopleKey(sigId: string) { return `acm_sig_people_${sigId}`; }

function loadPeople(sigId: string) {
  const raw = localStorage.getItem(sigPeopleKey(sigId));
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  return { committee: [], faculty: [] };
}

function savePeople(sigId: string, data: any) {
  localStorage.setItem(sigPeopleKey(sigId), JSON.stringify(data));
}

interface SigDetailProps {
  sig: any;
  onBack: () => void;
}

export default function SigDetail({ sig, onBack }: SigDetailProps) {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"committee" | "faculty">("committee");
  const [editingPerson, setEditingPerson] = useState<any>(null);
  const [people, setPeople] = useState<{ committee: any[]; faculty: any[] }>({ committee: [], faculty: [] });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setPeople(loadPeople(sig._id));
  }, [sig._id, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleAddPerson = (type: "committee" | "faculty") => {
    setModalType(type);
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  const handleEditPerson = (person: any, type: "committee" | "faculty") => {
    setModalType(type);
    setEditingPerson(person);
    setIsModalOpen(true);
  };

  const handleDeletePerson = (id: string, name: string, type: "committee" | "faculty") => {
    if (!window.confirm(`Remove ${name} from this SIG?`)) return;
    const data = loadPeople(sig._id);
    data[type] = data[type].filter((p: any) => p._id !== id);
    savePeople(sig._id, data);
    auditLog("REMOVE_SIG_PERSON", "sigs", `Removed ${name} from ${sig.name} ${type}`, "info");
    success("Member Removed", `Successfully removed ${name}.`);
    refresh();
  };

  const handleMoveOrder = (person: any, direction: "up" | "down", type: "committee" | "faculty") => {
    const data = loadPeople(sig._id);
    const list = [...data[type]];
    const index = list.findIndex((p: any) => p._id === person._id);
    if (index === -1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    data[type] = list;
    savePeople(sig._id, data);
    refresh();
  };

  const renderPersonRow = (person: any, index: number, type: "committee" | "faculty", listLength: number) => (
    <div key={person._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-tertiary)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {person.imageUrl ? (
            <img src={person.imageUrl} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <User size={18} style={{ color: "var(--text-tertiary)" }} />
          )}
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>{person.name}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {person.role} {type === "faculty" && person.department ? `(${person.department})` : ""}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => handleMoveOrder(person, "up", type)} disabled={index === 0} className="btn btn-secondary" style={{ padding: "4px", borderRadius: "6px" }}><ArrowUp size={12} /></button>
        <button onClick={() => handleMoveOrder(person, "down", type)} disabled={index === listLength - 1} className="btn btn-secondary" style={{ padding: "4px", borderRadius: "6px" }}><ArrowDown size={12} /></button>
        <button onClick={() => handleEditPerson(person, type)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }}><Edit2 size={12} /></button>
        <button onClick={() => handleDeletePerson(person._id, person.name, type)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}><Trash2 size={12} /></button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ padding: "8px 12px" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>{sig.name} Detail</h2>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Focus: {sig.focusArea} | Members: {sig.membersCount}</span>
        </div>
      </div>

      {/* Faculty Section */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Faculty Mentors & Advisors</h3>
          <button onClick={() => handleAddPerson("faculty")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Plus size={14} /> Add Faculty Mentor
          </button>
        </div>
        {people.faculty.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>No faculty advisors assigned yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {people.faculty.map((mentor, i) => renderPersonRow(mentor, i, "faculty", people.faculty.length))}
          </div>
        )}
      </div>

      {/* Committee Section */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Student Committee Leads & Coordinators</h3>
          <button onClick={() => handleAddPerson("committee")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Plus size={14} /> Add Coordinator
          </button>
        </div>
        {people.committee.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>No student coordinators assigned yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {people.committee.map((member, i) => renderPersonRow(member, i, "committee", people.committee.length))}
          </div>
        )}
      </div>

      {/* Person Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPerson ? `Edit ${modalType === "committee" ? "Coordinator" : "Faculty Mentor"}` : `Add ${modalType === "committee" ? "Coordinator" : "Faculty Mentor"}`}
        maxWidth="500px"
      >
        <PersonForm
          sigId={sig._id}
          type={modalType}
          person={editingPerson}
          onSuccess={() => {
            setIsModalOpen(false);
            success(editingPerson ? "Details Updated" : "Added Successfully", "Saved team member profile changes.");
            refresh();
          }}
          onCancel={() => setIsModalOpen(false)}
          currentCount={modalType === "committee" ? people.committee.length : people.faculty.length}
        />
      </Modal>
    </div>
  );
}
