import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import ImageUpload from "../../components/ImageUpload";
import { Globe } from "lucide-react";

interface PersonFormProps {
  sigId: any;
  type: "committee" | "faculty";
  person?: any;
  onSuccess: () => void;
  onCancel: () => void;
  currentCount: number;
}

export default function PersonForm({
  sigId,
  type,
  person,
  onSuccess,
  onCancel,
  currentCount,
}: PersonFormProps) {
  const { token } = useAuth();
  
  const addCommittee = useMutation(api.sig_people.addCommittee);
  const updateCommittee = useMutation(api.sig_people.updateCommittee);
  const addFaculty = useMutation(api.sig_people.addFaculty);
  const updateFaculty = useMutation(api.sig_people.updateFaculty);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Social Links state
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (person) {
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
    }
  }, [person]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError("Name and Role are required.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const socialLinks = {
      github: github || undefined,
      linkedin: linkedin || undefined,
      twitter: twitter || undefined,
      instagram: instagram || undefined,
      website: website || undefined,
    };

    try {
      if (type === "committee") {
        if (person) {
          await updateCommittee({
            token: token!,
            id: person._id,
            name,
            role,
            bio: bio || undefined,
            email: email || undefined,
            imageUrl: imageUrl || undefined,
            socialLinks,
            displayOrder: person.displayOrder,
          });
        } else {
          await addCommittee({
            token: token!,
            sigId,
            name,
            role,
            bio: bio || undefined,
            email: email || undefined,
            imageUrl: imageUrl || undefined,
            socialLinks,
            displayOrder: currentCount,
          });
        }
      } else {
        if (person) {
          await updateFaculty({
            token: token!,
            id: person._id,
            name,
            role,
            department: department || undefined,
            bio: bio || undefined,
            imageUrl: imageUrl || undefined,
            socialLinks,
            displayOrder: person.displayOrder,
          });
        } else {
          await addFaculty({
            token: token!,
            sigId,
            name,
            role,
            department: department || undefined,
            bio: bio || undefined,
            imageUrl: imageUrl || undefined,
            socialLinks,
            displayOrder: currentCount,
          });
        }
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save team member details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && (
        <div style={{
          backgroundColor: "rgba(255, 69, 58, 0.1)",
          border: "1px solid #ff453a",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          color: "#ff453a",
          fontSize: "13px"
        }}>
          {error}
        </div>
      )}

      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="Profile Photo"
        ratioText="Square photo recommended, max 2MB"
      />

      <div className="form-group">
        <label className="form-label">Full Name*</label>
        <input
          type="text"
          className="form-input"
          placeholder="Dr. Rajesh / Amit Kumar"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Role / Designation*</label>
          <input
            type="text"
            className="form-input"
            placeholder={type === "committee" ? "Lead Coordinator / Member" : "SIG Mentor / Assistant Professor"}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        {type === "faculty" ? (
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
              placeholder="amit@amrita.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Short Bio</label>
        <textarea
          className="form-input"
          placeholder="Brief introduction / academic interests..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          style={{ resize: "none", fontFamily: "var(--font-family)", fontSize: "14px" }}
        />
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
        <label className="form-label" style={{ marginBottom: "10px", display: "block", fontWeight: 600 }}>
          Social Profiles (URLs)
        </label>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "24px", fontSize: "11px", fontWeight: "bold", color: "var(--text-secondary)", textAlign: "center" }}>GH</span>
            <input
              type="url"
              className="form-input"
              placeholder="GitHub Profile Link"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              style={{ flex: 1, padding: "8px 12px" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "24px", fontSize: "11px", fontWeight: "bold", color: "var(--text-secondary)", textAlign: "center" }}>LN</span>
            <input
              type="url"
              className="form-input"
              placeholder="LinkedIn Profile Link"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              style={{ flex: 1, padding: "8px 12px" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "24px", fontSize: "11px", fontWeight: "bold", color: "var(--text-secondary)", textAlign: "center" }}>TW</span>
            <input
              type="url"
              className="form-input"
              placeholder="Twitter/X Link"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              style={{ flex: 1, padding: "8px 12px" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "24px", fontSize: "11px", fontWeight: "bold", color: "var(--text-secondary)", textAlign: "center" }}>IG</span>
            <input
              type="url"
              className="form-input"
              placeholder="Instagram Profile Link"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              style={{ flex: 1, padding: "8px 12px" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Globe size={16} color="var(--text-secondary)" />
            <input
              type="url"
              className="form-input"
              placeholder="Personal Website Link"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ flex: 1, padding: "8px 12px" }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save Member"}
        </button>
      </div>
    </form>
  );
}
