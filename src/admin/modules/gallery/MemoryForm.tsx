import React, { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import { loadGallery, saveGallery, loadEvents, genId, auditLog } from "../../lib/db";

interface MemoryFormProps {
  memory?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MemoryForm({ memory, onSuccess, onCancel }: MemoryFormProps) {
  const events = loadEvents();

  const [eventId, setEventId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [photos, setPhotos] = useState<string[]>([""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [published, setPublished] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (memory) {
      setEventId(memory.eventId || "");
      setTitle(memory.title || "");
      setSummary(memory.summary || "");
      setPhotos(memory.photos && memory.photos.length > 0 ? memory.photos : [""]);
      setVideoUrl(memory.videoUrl || "");
      setTagsText((memory.tags || []).join(", "));
      setPublished(memory.published || false);
    }
  }, [memory]);

  const handlePhotoChange = (index: number, url: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = url;
    setPhotos(newPhotos);
  };

  const handleAddPhoto = () => {
    setPhotos([...photos, ""]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) {
      setError("Please select an associated event.");
      return;
    }
    if (!title.trim() || !summary.trim()) {
      setError("Title and Summary are required.");
      return;
    }

    const filteredPhotos = photos.map(p => p.trim()).filter(p => p.length > 0);
    if (filteredPhotos.length === 0) {
      setError("At least one gallery photo is required.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      eventId,
      title,
      summary,
      photos: filteredPhotos,
      videoUrl: videoUrl || undefined,
      tags: tags.length > 0 ? tags : undefined,
      published,
    };

    try {
      const all = loadGallery();
      if (memory) {
        const updated = all.map((m: any) => m._id === memory._id ? { ...m, ...payload } : m);
        saveGallery(updated);
        auditLog("UPDATE_MEMORY", "gallery", `Updated memory: ${title}`, "info");
      } else {
        const newMemory = { _id: genId("mem"), ...payload, createdAt: new Date().toISOString() };
        saveGallery([...all, newMemory]);
        auditLog("CREATE_MEMORY", "gallery", `Created memory: ${title}`, "info");
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save gallery memory.");
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Associated Event*</label>
          <select 
            className="custom-select" 
            value={eventId} 
            onChange={(e) => setEventId(e.target.value)}
            required
          >
            <option value="">Select Event</option>
            {events?.map((ev) => (
              <option key={ev._id} value={ev._id}>{ev.title} ({new Date(ev.date).toLocaleDateString()})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Memory Title*</label>
          <input
            type="text"
            className="form-input"
            placeholder="Devspace 2026 recap highlights"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Summary / Description*</label>
        <textarea
          className="form-input"
          placeholder="Write a recap of the event outcomes, achievements, participation and feedback..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={4}
          style={{ resize: "vertical", fontFamily: "var(--font-family)", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Recap Video Link (Optional)</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags (Comma separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="recap, webdev, competition"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px", background: "rgba(255, 255, 255, 0.01)" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>
          Gallery Photos*
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {photos.map((photo, index) => (
            <div key={index} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <ImageUpload
                  value={photo}
                  onChange={(url) => handlePhotoChange(index, url)}
                  label={`Gallery Photo #${index + 1}`}
                  ratioText="Landscape format recommended (16:9)"
                />
              </div>
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="btn btn-secondary"
                  style={{ height: "42px", color: "#ff453a", borderColor: "#ff453a", padding: "0 16px" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddPhoto}
          className="btn btn-secondary"
          style={{ marginTop: "16px" }}
        >
          + Add Another Photo
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          Publish Gallery Live
        </label>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Memory"}
          </button>
        </div>
      </div>
    </form>
  );
}
