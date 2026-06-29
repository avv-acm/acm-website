import React, { useState, useEffect } from "react";
import { useToast } from "../../components/Toast";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import { dbLoad, dbSave, genId, auditLog } from "../../lib/db";
import { Plus, Edit2, Trash2, User, ArrowUp, ArrowDown, Globe } from "lucide-react";

const LEADERSHIP_KEY = "acm_portal_committee";
const FACULTY_KEY = "acm_portal_faculty";

function loadCommittee() { return dbLoad<any>(LEADERSHIP_KEY, []); }
function loadFaculty() { return dbLoad<any>(FACULTY_KEY, []); }

export default function LeadershipPanel() {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelType, setPanelType] = useState<"committee" | "faculty">("committee");
  const [editingPerson, setEditingPerson] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [committee, setCommittee] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);

  useEffect(() => {
    setCommittee(loadCommittee());
    setFaculty(loadFaculty());
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  // Form states
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
    setName(""); setRole(""); setDepartment(""); setBio(""); setEmail(""); setImageUrl("");
    setGithub(""); setLinkedin(""); setTwitter(""); setInstagram(""); setWebsite("");
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
    setName(person.name || ""); setRole(person.role || ""); setDepartment(person.department || "");
    setBio(person.bio || ""); setEmail(person.email || ""); setImageUrl(person.imageUrl || "");
    const s = person.socialLinks || {};
    setGithub(s.github || ""); setLinkedin(s.linkedin || ""); setTwitter(s.twitter || "");
    setInstagram(s.instagram || ""); setWebsite(s.website || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, personName: string, type: "committee" | "faculty") => {
    if (!window.confirm(`Remove ${personName} from leadership?`)) return;
    const key = type === "committee" ? LEADERSHIP_KEY : FACULTY_KEY;
    const list = dbLoad<any>(key);
    dbSave(key, list.filter((p: any) => p._id !== id));
    auditLog("REMOVE_LEADER", type === "committee" ? "core_committee" : "faculty_advisors", `Removed ${personName}`, "warning");
    success("Removed Successfully", `Removed ${personName} from leadership.`);
    refresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    setSubmitting(true);
    const socialLinks = { github: github || undefined, linkedin: linkedin || undefined, twitter: twitter || undefined, instagram: instagram || undefined, website: website || undefined };
    const payload: any = { name, role, bio: bio || undefined, email: email || undefined, imageUrl: imageUrl || undefined, socialLinks };
    if (panelType === "faculty") payload.department = department || undefined;

    const key = panelType === "committee" ? LEADERSHIP_KEY : FACULTY_KEY;
    const list = dbLoad<any>(key);

    if (editingPerson) {
      dbSave(key, list.map((p: any) => p._id === editingPerson._id ? { ...p, ...payload } : p));
      auditLog("UPDATE_LEADER", key, `Updated ${name}`, "info");
    } else {
      dbSave(key, [...list, { _id: genId("leader"), ...payload, displayOrder: list.length }]);
      auditLog("ADD_LEADER", key, `Added ${name}`, "info");
    }

    success(editingPerson ? "Entry Updated" : "Added Successfully", "Updated club leadership records.");
    setIsModalOpen(false);
    resetForm();
    setSubmitting(false);
    refresh();
  };

  const handleMoveOrder = (person: any, direction: "up" | "down", type: "committee" | "faculty") => {
    const key = type === "committee" ? LEADERSHIP_KEY : FACULTY_KEY;
    const list = [...dbLoad<any>(key)];
    const index = list.findIndex((p: any) => p._id === person._id);
    if (index === -1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    dbSave(key, list);
    refresh();
  };

  const renderPerson = (person: any, index: number, type: "committee" | "faculty", listLength: number) => (
    <div key={person._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-tertiary)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {person.imageUrl ? <img src={person.imageUrl} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={18} style={{ color: "var(--text-tertiary)" }} />}
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>{person.name}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{person.role} {type === "faculty" && person.department ? `(${person.department})` : ""}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => handleMoveOrder(person, "up", type)} disabled={index === 0} className="btn btn-secondary" style={{ padding: "4px", borderRadius: "6px" }}><ArrowUp size={12} /></button>
        <button onClick={() => handleMoveOrder(person, "down", type)} disabled={index === listLength - 1} className="btn btn-secondary" style={{ padding: "4px", borderRadius: "6px" }}><ArrowDown size={12} /></button>
        <button onClick={() => handleEdit(person, type)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }}><Edit2 size={12} /></button>
        <button onClick={() => handleDelete(person._id, person.name, type)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}><Trash2 size={12} /></button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Faculty Advisors Section */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Club Faculty Advisors</h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Faculty mentors guiding the ACM Student Chapter.</p>
          </div>
          <button onClick={() => handleAdd("faculty")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}><Plus size={14} /> Add Faculty Advisor</button>
        </div>
        {faculty.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>No faculty advisors listed.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faculty.map((mentor, i) => renderPerson(mentor, i, "faculty", faculty.length))}
          </div>
        )}
      </div>

      {/* Core Committee Section */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>ACM Core Committee</h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Student officers and leaders heading ACM operations.</p>
          </div>
          <button onClick={() => handleAdd("committee")} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}><Plus size={14} /> Add Core Committee</button>
        </div>
        {committee.length === 0 ? (
          <div style={{ color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center", padding: "20px" }}>No core committee members listed.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {committee.map((member, i) => renderPerson(member, i, "committee", committee.length))}
          </div>
        )}
      </div>

      {/* Leadership Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPerson ? "Edit Leadership Profile" : "Add Leadership Profile"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <ImageUpload value={imageUrl} onChange={setImageUrl} label="Profile Image" ratioText="Square photo recommended, max 2MB" />

          <div className="form-group">
            <label className="form-label">Full Name*</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Role / Title*</label>
              <input type="text" className="form-input" placeholder={panelType === "committee" ? "Chairperson / Vice-Chair" : "Club Advisor"} value={role} onChange={(e) => setRole(e.target.value)} required />
            </div>
            {panelType === "faculty" ? (
              <div className="form-group">
                <label className="form-label">Department</label>
                <input type="text" className="form-input" placeholder="Dept of CSE" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="name@amrita.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Short Biography</label>
            <textarea className="form-input" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ resize: "none", fontFamily: "var(--font-family)", fontSize: "14px" }} />
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
            <label className="form-label" style={{ marginBottom: "10px", display: "block", fontWeight: 600 }}>Social Profiles (URLs)</label>
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
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : "Save Profile"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
