import React, { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import { loadAdminSigs, saveAdminSigs, genId, auditLog } from "../../lib/db";

interface SigFormProps {
  sig?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SigForm({ sig, onSuccess, onCancel }: SigFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "archived">("active");
  const [membersCount, setMembersCount] = useState(0);
  const [activeProject, setActiveProject] = useState("");
  const [projectStatus, setProjectStatus] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-generate slug from name during creation
  useEffect(() => {
    if (!sig && name.trim()) {
      setSlug(
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces/hyphens
          .replace(/\s+/g, "-") // replace spaces with hyphens
      );
    }
  }, [name, sig]);

  // Load editing state
  useEffect(() => {
    if (sig) {
      setName(sig.name || "");
      setSlug(sig.slug || "");
      setDescription(sig.description || "");
      setFocusArea(sig.focusArea || "");
      setContactEmail(sig.contactEmail || "");
      setBannerImageUrl(sig.bannerImageUrl || "");
      setStatus(sig.status || "active");
      setMembersCount(sig.membersCount || 0);
      setActiveProject(sig.activeProject || "");
      setProjectStatus(sig.projectStatus || "");
    }
  }, [sig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !description.trim() || !focusArea.trim()) {
      setError("Name, Slug, Description and Focus Area are required.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      focusArea,
      contactEmail: contactEmail || undefined,
      bannerImageUrl: bannerImageUrl || undefined,
      status,
      membersCount,
      activeProject: activeProject || undefined,
      projectStatus: projectStatus || undefined,
    };

    try {
      const all = loadAdminSigs();
      if (sig) {
        const updated = all.map((s: any) => s._id === sig._id ? { ...s, ...payload } : s);
        saveAdminSigs(updated);
        auditLog("UPDATE_SIG", "sigs", `Updated SIG: ${name}`, "info");
      } else {
        const newSig = { _id: genId("sig"), ...payload, createdAt: new Date().toISOString() };
        saveAdminSigs([...all, newSig]);
        auditLog("CREATE_SIG", "sigs", `Created SIG: ${name}`, "info");
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save Special Interest Group.");
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
        value={bannerImageUrl}
        onChange={setBannerImageUrl}
        label="SIG Banner Graphic"
        ratioText="Landscape banner recommended, max 2MB"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">SIG Name*</label>
          <input
            type="text"
            className="form-input"
            placeholder="Cybersecurity SIG"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Unique Slug URL*</label>
          <input
            type="text"
            className="form-input"
            placeholder="cybersecurity"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            disabled={!!sig} // Disable slug change once created to maintain URL integrity
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Focus Area*</label>
          <input
            type="text"
            className="form-input"
            placeholder="Penetration Testing, Cryptography"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="cybersec-acm@amrita.edu"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">SIG Description*</label>
        <textarea
          className="form-input"
          placeholder="Brief description about SIG objectives, research areas, and activities..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          style={{ resize: "vertical", fontFamily: "var(--font-family)", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Active Project Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="CTF Platform Dev"
            value={activeProject}
            onChange={(e) => setActiveProject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Status</label>
          <input
            type="text"
            className="form-input"
            placeholder="In Development / Testing"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Initial Members Count</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={membersCount}
            onChange={(e) => setMembersCount(Number(e.target.value))}
            min={0}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="custom-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save SIG"}
        </button>
      </div>
    </form>
  );
}
