import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  User, 
  ArrowUp, 
  ArrowDown,
  Globe
} from "lucide-react";

export default function LeadershipPanel() {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelType, setPanelType] = useState<"committee" | "faculty">("committee");
  const [editingPerson, setEditingPerson] = useState<any>(null);

  // Queries
  const committee = useQuery(api.leadership.listCommitteeAdmin, token ? { token } : "skip");
  const faculty = useQuery(api.leadership.listFacultyAdmin, token ? { token } : "skip");

  // Mutations
  const addCommittee = useMutation(api.leadership.addCommitteeMember);
  const updateCommittee = useMutation(api.leadership.updateCommitteeMember);
  const removeCommittee = useMutation(api.leadership.removeCommitteeMember);

  const addFaculty = useMutation(api.leadership.addFacultyAdvisor);
  const updateFaculty = useMutation(api.leadership.updateFacultyAdvisor);
  const removeFaculty = useMutation(api.leadership.removeFacultyAdvisor);

  // Form States
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setRole("");
    setDepartment("");
    setBio("");
    setEmail("");
    setImageUrl("");
    setGithub("");
    setLinkedin("");
    setTwitter("");
    setInstagram("");
    setWebsite("");
  };

  const handleAdd = (type: "committee" | "faculty") => {
    setPanelType(type);
    setEditingPerson(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (person: any, type: "committee" | "faculty") => {
    setPanelType(type);
    setEditingPerson(person);
    
    setName(person.name || "");
    setRole(person.role || "");
    setDepartment(person.department || "");
    setBio(person.bio || "");
    setEmail(person.email || "");
    setImageUrl(person.imageUrl || "");
    
    const socials = person.socialLinks || {};
    setGithub(socials.github || "");
    setLinkedin(socials.linkedin || "");
    setTwitter(socials.twitter || "");
    setInstagram(socials.instagram || "");
    setWebsite(socials.website || "");
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any, name: string, type: "committee" | "faculty") => {
    if (!window.confirm(`Are you sure you want to remove ${name} from leadership?`)) return;

    try {
      if (type === "committee") {
        await removeCommittee({ token: token!, id });
      } else {
        await removeFaculty({ token: token!, id });
      }
      success("Removed Successfully", `Removed ${name} from club leadership list.`);
    } catch (err: any) {
      error("Removal Failed", err.message || "Could not delete leadership entry.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    setSubmitting(true);
    const socialLinks = {
      github: github || undefined,
      linkedin: linkedin || undefined,
      twitter: twitter || undefined,
      instagram: instagram || undefined,
      website: website || undefined,
    };

    const payload: any = {
      token: token!,
      name,
      role,
      bio: bio || undefined,
      email: email || undefined,
      imageUrl: imageUrl || undefined,
      socialLinks,
    };

    try {
      if (panelType === "committee") {
        if (editingPerson) {
          await updateCommittee({ id: editingPerson._id, displayOrder: editingPerson.displayOrder, ...payload });
        } else {
          await addCommittee({ displayOrder: committee ? committee.length : 0, ...payload });
        }
      } else {
        payload.department = department || undefined;
        if (editingPerson) {
          await updateFaculty({ id: editingPerson._id, displayOrder: editingPerson.displayOrder, ...payload });
        } else {
          await addFaculty({ displayOrder: faculty ? faculty.length : 0, ...payload });
        }
      }

      success(editingPerson ? "Entry Updated" : "Added Successfully", "Updated club leadership records.");
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      error("Saving Failed", err.message || "Could not save leadership member details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMoveOrder = async (
    person: any, 
    direction: "up" | "down", 
    type: "committee" | "faculty"
  ) => {
    const list = type === "committee" ? (committee ? [...committee] : []) : (faculty ? [...faculty] : []);
    const index = list.findIndex((p) => p._id === person._id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;

    const target = list[newIndex];
    try {
      const updateMut = type === "committee" ? updateCommittee : updateFaculty;
      
      const payloadPerson = {
        token: token!,
        name: person.name,
        role: person.role,
        bio: person.bio,
        email: person.email,
        imageUrl: person.imageUrl,
        socialLinks: person.socialLinks,
        displayOrder: target.displayOrder
      };

      const payloadTarget = {
        token: token!,
        name: target.name,
        role: target.role,
        bio: target.bio,
        email: target.email,
        imageUrl: target.imageUrl,
        socialLinks: target.socialLinks,
        displayOrder: person.displayOrder
      };

      if (type === "faculty") {
        (payloadPerson as any).department = person.department;
        (payloadTarget as any).department = target.department;
      }

      await updateMut({ id: person._id, ...payloadPerson });
      await updateMut({ id: target._id, ...payloadTarget });
      success("Order Swapped", "Ordering has been updated.");
    } catch (err: any) {
      error("Reordering Failed", err.message || "Failed to swap member order.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ─── Faculty Advisors Section ───────────────────────── */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Club Faculty Advisors</h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Faculty mentors guiding the ACM Student Chapter.
            </p>
          </div>
          <button onClick={() => handleAdd("faculty")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Plus size={14} /> Add Faculty Advisor
          </button>
        </div>

        {!faculty ? (
          <div>Loading faculty advisors...</div>
        ) : faculty.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>
            No faculty advisors listed.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faculty.map((mentor, index) => (
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
                      disabled={index === faculty.length - 1}
                      className="btn btn-secondary" 
                      style={{ padding: "4px", borderRadius: "6px" }}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button onClick={() => handleEdit(mentor, "faculty")} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(mentor._id, mentor.name, "faculty")} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Core Committee Section ────────────────────────── */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>ACM Core Committee</h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Student officers and leaders heading ACM operations.
            </p>
          </div>
          <button onClick={() => handleAdd("committee")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Plus size={14} /> Add Core Committee
          </button>
        </div>

        {!committee ? (
          <div>Loading core committee...</div>
        ) : committee.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>
            No core committee members listed.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {committee.map((member, index) => (
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
                      disabled={index === committee.length - 1}
                      className="btn btn-secondary" 
                      style={{ padding: "4px", borderRadius: "6px" }}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button onClick={() => handleEdit(member, "committee")} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(member._id, member.name, "committee")} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leadership Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPerson ? "Edit Leadership Profile" : "Add Leadership Profile"}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            label="Profile Image"
            ratioText="Square photo recommended, max 2MB"
          />

          <div className="form-group">
            <label className="form-label">Full Name*</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Role / Title*</label>
              <input
                type="text"
                className="form-input"
                placeholder={panelType === "committee" ? "Chairperson / Vice-Chair" : "Club Advisor / Coordinator"}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>

            {panelType === "faculty" ? (
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dept of CSE"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@amrita.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Short Biography</label>
            <textarea
              className="form-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              style={{ resize: "none", fontFamily: "var(--font-family)", fontSize: "14px" }}
            />
          </div>

          {/* Social Profiles */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
            <label className="form-label" style={{ marginBottom: "10px", display: "block", fontWeight: 600 }}>
              Social Profiles (URLs)
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "24px", fontSize: "11px", fontWeight: "bold", color: "var(--text-secondary)", textAlign: "center" }}>GH</span>
                <input type="url" className="form-input" placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} style={{ flex: 1, padding: "8px 12px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "24px", fontSize: "11px", fontWeight: "bold", color: "var(--text-secondary)", textAlign: "center" }}>LN</span>
                <input type="url" className="form-input" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} style={{ flex: 1, padding: "8px 12px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Globe size={16} />
                <input type="url" className="form-input" placeholder="Personal Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ flex: 1, padding: "8px 12px" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
