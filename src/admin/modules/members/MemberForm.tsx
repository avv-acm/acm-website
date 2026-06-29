import React, { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import { loadMembers, saveMembers, loadAdminSigs, genId, auditLog } from "../../lib/db";

interface MemberFormProps {
  member?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MemberForm({ member, onSuccess, onCancel }: MemberFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [type, setType] = useState<"student" | "faculty">("student");
  const [designation, setDesignation] = useState("");
  const [sigRole, setSigRole] = useState("");
  const [sigAssociation, setSigAssociation] = useState("");
  const [section, setSection] = useState("");

  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [year, setYear] = useState("1st Year");
  const [department, setDepartment] = useState("Computer Science and Engineering");
  const [role, setRole] = useState("Member");
  const [status, setStatus] = useState("active");
  const [phone, setPhone] = useState("");
  const [interestsText, setInterestsText] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load SIGs from localStorage
  const sigs = loadAdminSigs();

  useEffect(() => {
    if (member) {
      setName(member.name || "");
      setEmail(member.email || "");
      setStudentId(member.studentId || member.rollNo || "");
      setType(member.type || "student");
      setDesignation(member.designation || "");
      setSigRole(member.sigRole || "");
      setSigAssociation(member.sigAssociation || "");
      setSection(member.section || "");

      if (member.socialLinks) {
        setGithub(member.socialLinks.github || "");
        setLinkedin(member.socialLinks.linkedin || "");
        setInstagram(member.socialLinks.instagram || "");
        setWhatsapp(member.socialLinks.whatsapp || "");
      } else {
        setGithub(member.github || "");
        setLinkedin(member.linkedin || "");
        setInstagram(member.instagram || "");
        setWhatsapp(member.whatsapp || "");
      }

      setYear(member.year || "1st Year");
      setDepartment(member.department || "Computer Science and Engineering");
      setRole(member.role || "Member");
      setStatus(member.status || "active");
      setPhone(member.phone || "");
      setInterestsText((member.interests || []).join(", "));
      setProfileImageUrl(member.profileImageUrl || "");
    }
  }, [member]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const emailVal = val.trim().toUpperCase();
    const rollMatch = emailVal.match(/^([A-Z0-9.-]+)@(?:NC\.STUDENTS\.AMRITA\.EDU|AM\.AMRITA\.EDU)$/i);
    
    if (rollMatch) {
      const roll = rollMatch[1];
      setStudentId(roll);
      
      const match = roll.match(/U4([A-Z]+)(\d{2})\d*/i);
      if (match) {
        const deptCode = match[1].toUpperCase();
        const batchShort = parseInt(match[2]);
        const batchYear = 2000 + batchShort;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        let academicYear = currentYear;
        if (currentMonth < 6) academicYear -= 1;
        let yearNum = academicYear - batchYear + 1;
        if (yearNum < 1) yearNum = 1;
        if (yearNum > 4) yearNum = 4;
        
        const yearMap: Record<number, string> = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };
        setYear(yearMap[yearNum] || "1st Year");
        
        const deptMap: Record<string, string> = {
          CSE: "Computer Science and Engineering",
          AID: "Artificial Intelligence and Data Science",
          ECE: "Electronics Communication Engineering",
        };
        setDepartment(deptMap[deptCode] || deptCode);
      }
    } else {
      const parts = emailVal.split("@");
      if (parts.length > 0 && !studentId) {
        setStudentId(parts[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !studentId.trim()) {
      setError("Name, email, and Student ID are required fields.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const interests = interestsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name,
      email,
      studentId,
      rollNo: studentId,
      type,
      designation: type === "faculty" ? designation : undefined,
      sigRole: type === "student" ? sigRole : undefined,
      sigAssociation: type === "student" && sigAssociation ? sigAssociation : undefined,
      section: type === "student" ? section : undefined,
      socialLinks: { github: github || undefined, linkedin: linkedin || undefined, instagram: instagram || undefined, whatsapp: whatsapp || undefined },
      year,
      department,
      role,
      status,
      phone: phone || undefined,
      interests,
      profileImageUrl: profileImageUrl || undefined,
    };

    try {
      const all = loadMembers();
      if (member) {
        const updated = all.map((m) => (m._id === member._id ? { ...m, ...payload } : m));
        saveMembers(updated);
        auditLog("UPDATE_MEMBER", "members", `Updated member: ${name}`, "info");
      } else {
        const newMember = { _id: genId("ACM"), ...payload, joinedAt: new Date().toISOString() };
        saveMembers([newMember, ...all]);
        auditLog("ADD_MEMBER", "members", `Added new member: ${name}`, "info");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save member details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && (
        <div style={{ backgroundColor: "rgba(255, 69, 58, 0.1)", border: "1px solid #ff453a", borderRadius: "var(--radius-md)", padding: "12px 16px", color: "#ff453a", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <ImageUpload value={profileImageUrl} onChange={setProfileImageUrl} label="Profile Image" ratioText="Square photo recommended, max 2MB" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Full Name*</label>
          <input type="text" className="form-input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Roll Number / Roll ID*</label>
          <input type="text" className="form-input" placeholder="NC.SC.U4CSE24229" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Email Address*</label>
          <input type="email" className="form-input" placeholder="NC.SC.U4CSE24229@nc.students.amrita.edu" value={email} onChange={(e) => handleEmailChange(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="tel" className="form-input" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Profile Type</label>
          <select className="custom-select" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="student">Student Member</option>
            <option value="faculty">Faculty Mentor / Advisor</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="custom-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="alumni">Alumni</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {type === "student" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select className="custom-select" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="custom-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="Computer Science and Engineering">CSE</option>
                <option value="Artificial Intelligence and Data Science">AID</option>
                <option value="Electrical and Communication Engineering">ECE</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section</label>
              <input type="text" className="form-input" placeholder="A / B / C" value={section} onChange={(e) => setSection(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">SIG Association</label>
              <select className="custom-select" value={sigAssociation} onChange={(e) => setSigAssociation(e.target.value)}>
                <option value="">None</option>
                {sigs.map((sig: any) => (
                  <option key={sig._id} value={sig._id}>{sig.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">SIG Role</label>
              <input type="text" className="form-input" placeholder="WebDev Lead / Core Member" value={sigRole} onChange={(e) => setSigRole(e.target.value)} />
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Academic Designation</label>
            <input type="text" className="form-input" placeholder="Assistant Professor" value={designation} onChange={(e) => setDesignation(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input type="text" className="form-input" placeholder="CSE / ECE / MATH" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Role / Position in Club</label>
          <input type="text" className="form-input" placeholder="Member / Chairperson / Advisor" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Interests (Comma separated)</label>
          <input type="text" className="form-input" placeholder="WebDev, ML, IoT" value={interestsText} onChange={(e) => setInterestsText(e.target.value)} />
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: "var(--text-secondary)" }}>Social Profile Links</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input type="url" className="form-input" placeholder="https://linkedin.com/in/username" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input type="url" className="form-input" placeholder="https://github.com/username" value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
          <div className="form-group">
            <label className="form-label">Instagram URL</label>
            <input type="url" className="form-input" placeholder="https://instagram.com/username" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp Contact Link</label>
            <input type="url" className="form-input" placeholder="https://wa.me/919876543210" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save Member"}
        </button>
      </div>
    </form>
  );
}
