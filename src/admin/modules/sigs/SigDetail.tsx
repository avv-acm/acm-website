import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import Modal from "../../components/Modal";
import PersonForm from "./PersonForm";
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  User, 
  ArrowUp, 
  ArrowDown, 
  Github, 
  Linkedin, 
  Globe 
} from "lucide-react";

interface SigDetailProps {
  sig: any;
  onBack: () => void;
}

export default function SigDetail({ sig, onBack }: SigDetailProps) {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"committee" | "faculty">("committee");
  const [editingPerson, setEditingPerson] = useState<any>(null);

  // Queries
  const people = useQuery(api.sig_people.listPeopleBySig, { sigId: sig._id });

  // Mutations
  const addCommitteeMutation = useMutation(api.sig_people.addCommittee);
  const updateCommitteeMutation = useMutation(api.sig_people.updateCommittee);
  const removeCommitteeMutation = useMutation(api.sig_people.removeCommittee);

  const addFacultyMutation = useMutation(api.sig_people.addFaculty);
  const updateFacultyMutation = useMutation(api.sig_people.updateFaculty);
  const removeFacultyMutation = useMutation(api.sig_people.removeFaculty);

  // Handlers for Add/Edit
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

  // Handlers for Delete
  const handleDeletePerson = async (id: any, name: string, type: "committee" | "faculty") => {
    if (!window.confirm(`Are you sure you want to remove ${name} from this SIG?`)) return;

    try {
      if (type === "committee") {
        await removeCommitteeMutation({ token: token!, id });
      } else {
        await removeFacultyMutation({ token: token!, id });
      }
      success("Member Removed", `Successfully removed ${name}.`);
    } catch (err: any) {
      error("Action Failed", err.message || `Could not remove member.`);
    }
  };

  // Re-ordering logic
  const handleMoveOrder = async (
    person: any, 
    direction: "up" | "down", 
    type: "committee" | "faculty"
  ) => {
    if (!people) return;
    const list = type === "committee" ? [...people.committee] : [...people.faculty];
    const index = list.findIndex((p) => p._id === person._id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return; // Out of bounds

    // Swap displayOrder values
    const target = list[newIndex];
    try {
      const updateMut = type === "committee" ? updateCommitteeMutation : updateFacultyMutation;
      
      await updateMut({
        token: token!,
        id: person._id,
        name: person.name,
        role: person.role,
        bio: person.bio,
        email: person.email,
        imageUrl: person.imageUrl,
        socialLinks: person.socialLinks,
        displayOrder: target.displayOrder
      });

      await updateMut({
        token: token!,
        id: target._id,
        name: target.name,
        role: target.role,
        bio: target.bio,
        email: target.email,
        imageUrl: target.imageUrl,
        socialLinks: target.socialLinks,
        displayOrder: person.displayOrder
      });

      success("Order Changed", "Successfully reordered team list.");
    } catch (err: any) {
      error("Order Failed", err.message || "Failed to update member ordering.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Detail Header / Back */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ padding: "8px 12px" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>{sig.name} Detail</h2>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Category URL: /{sig.slug} | Focus: {sig.focusArea}
          </span>
        </div>
      </div>

      {/* ─── Faculty Section ─────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Faculty Mentors & Advisors</h3>
          <button onClick={() => handleAddPerson("faculty")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Plus size={14} /> Add Faculty Mentor
          </button>
        </div>

        {!people ? (
          <div>Loading faculty...</div>
        ) : people.faculty.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>
            No faculty advisors assigned yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {people.faculty.map((mentor, index) => (
              <div 
                key={mentor._id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "12px 16px", 
                  border: "1px solid var(--border)", 
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-tertiary)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    {mentor.imageUrl ? (
                      <img src={mentor.imageUrl} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyCenter: "center", color: "var(--text-tertiary)" }}>
                        <User size={18} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{mentor.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {mentor.role} {mentor.department ? `(${mentor.department})` : ""}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Order control */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button 
                      onClick={() => handleMoveOrder(mentor, "up", "faculty")}
                      disabled={index === 0}
                      className="btn btn-secondary" 
                      style={{ padding: "4px", borderRadius: "6px" }}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button 
                      onClick={() => handleMoveOrder(mentor, "down", "faculty")}
                      disabled={index === people.faculty.length - 1}
                      className="btn btn-secondary" 
                      style={{ padding: "4px", borderRadius: "6px" }}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button 
                    onClick={() => handleEditPerson(mentor, "faculty")}
                    className="btn btn-secondary" 
                    style={{ padding: "6px", borderRadius: "8px" }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    onClick={() => handleDeletePerson(mentor._id, mentor.name, "faculty")}
                    className="btn btn-secondary" 
                    style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Committee Section ───────────────────────────────── */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Student Committee Leads & Coordinators</h3>
          <button onClick={() => handleAddPerson("committee")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Plus size={14} /> Add Coordinator
          </button>
        </div>

        {!people ? (
          <div>Loading committee...</div>
        ) : people.committee.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>
            No student coordinators assigned yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {people.committee.map((member, index) => (
              <div 
                key={member._id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "12px 16px", 
                  border: "1px solid var(--border)", 
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-tertiary)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyCenter: "center", color: "var(--text-tertiary)" }}>
                        <User size={18} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{member.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{member.role}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Order control */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button 
                      onClick={() => handleMoveOrder(member, "up", "committee")}
                      disabled={index === 0}
                      className="btn btn-secondary" 
                      style={{ padding: "4px", borderRadius: "6px" }}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button 
                      onClick={() => handleMoveOrder(member, "down", "committee")}
                      disabled={index === people.committee.length - 1}
                      className="btn btn-secondary" 
                      style={{ padding: "4px", borderRadius: "6px" }}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button 
                    onClick={() => handleEditPerson(member, "committee")}
                    className="btn btn-secondary" 
                    style={{ padding: "6px", borderRadius: "8px" }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    onClick={() => handleDeletePerson(member._id, member.name, "committee")}
                    className="btn btn-secondary" 
                    style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
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
            success(
              editingPerson ? "Details Updated" : "Added Successfully",
              `Saved team member profile changes.`
            );
          }}
          onCancel={() => setIsModalOpen(false)}
          currentCount={
            people 
              ? (modalType === "committee" ? people.committee.length : people.faculty.length) 
              : 0
          }
        />
      </Modal>
    </div>
  );
}
