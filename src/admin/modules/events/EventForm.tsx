import React, { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import { loadEvents, saveEvents, loadAdminSigs, genId, auditLog } from "../../lib/db";

interface EventFormProps {
  event?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const sigs = loadAdminSigs();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [registrationStatus, setRegistrationStatus] = useState<"open" | "closed" | "full" | "upcoming">("upcoming");
  const [category, setCategory] = useState<"hackathon" | "workshop" | "sig" | "seminar" | "social" | "other">("workshop");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState("");

  const [sigId, setSigId] = useState("");
  const [rpName, setRpName] = useState("");
  const [rpDesignation, setRpDesignation] = useState("");
  const [rpOrganization, setRpOrganization] = useState("");
  const [rpImageUrl, setRpImageUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const formatInputDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const monthMap: Record<string, string> = {
      jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
      jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
      june: "06", july: "07"
    };
    const parts = dateStr.toLowerCase().split(/[ \-,]+/);
    let month = "";
    let day = "";
    for (const part of parts) {
      const clean = part.trim();
      if (!clean) continue;
      if (monthMap[clean.substring(0, 3)] || monthMap[clean]) {
        month = monthMap[clean.substring(0, 3)] || monthMap[clean];
      } else if (/^\d+$/.test(clean)) {
        day = clean.padStart(2, "0");
      }
    }
    if (month && day) return `2026-${month}-${day}`;
    return "";
  };

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDate(formatInputDate(event.date || ""));
      setTime(event.time || "");
      setEndTime(event.endTime || "");
      setLocation(event.location || "");
      setDescription(event.description || event.desc || "");
      setCapacity(event.capacity !== undefined ? event.capacity : "");
      setRegistrationStatus(event.registrationStatus || "upcoming");
      setCategory(event.category || "workshop");
      setFeatured(event.featured || false);
      setPublished(event.published || false);
      setBannerImageUrl(event.bannerImageUrl || "");
      setSigId(event.sigId || "");
      if (event.resourcePerson) {
        setRpName(event.resourcePerson.name || "");
        setRpDesignation(event.resourcePerson.designation || "");
        setRpOrganization(event.resourcePerson.organization || "");
        setRpImageUrl(event.resourcePerson.imageUrl || "");
      }
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !time.trim() || !location.trim() || !description.trim()) {
      setError("Please fill out all required fields (Title, Date, Time, Location, Description).");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = {
      title,
      date,
      time,
      endTime: endTime || undefined,
      location,
      description,
      desc: description,
      capacity: capacity === "" ? undefined : Number(capacity),
      registrationStatus,
      category,
      featured,
      published,
      bannerImageUrl: bannerImageUrl || undefined,
      image: bannerImageUrl || undefined,
      sigId: sigId || undefined,
      resourcePerson: rpName.trim() ? {
        name: rpName.trim(),
        designation: rpDesignation.trim() || undefined,
        organization: rpOrganization.trim() || undefined,
        imageUrl: rpImageUrl.trim() || undefined,
      } : undefined,
    };

    try {
      const all = loadEvents();
      if (event) {
        const updated = all.map((ev) => ev._id === event._id ? { ...ev, ...payload } : ev);
        saveEvents(updated);
        auditLog("UPDATE_EVENT", "events", `Updated event: ${title}`, "info");
      } else {
        const newEvent = { _id: genId("evt"), ...payload, createdAt: new Date().toISOString() };
        saveEvents([...all, newEvent]);
        auditLog("CREATE_EVENT", "events", `Created event: ${title}`, "info");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save event information.");
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

      <ImageUpload value={bannerImageUrl} onChange={setBannerImageUrl} label="Event Banner / Cover Image" ratioText="Landscape banner recommended (16:9), max 2MB" />

      <div className="form-group">
        <label className="form-label">Event Title*</label>
        <input type="text" className="form-input" placeholder="AI & ML Hands-on Workshop" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Date*</label>
          <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Category*</label>
          <select className="custom-select" value={category} onChange={(e) => setCategory(e.target.value as any)}>
            <option value="hackathon">Hackathon</option>
            <option value="workshop">Workshop</option>
            <option value="sig">SIG Event</option>
            <option value="seminar">Seminar</option>
            <option value="social">Social Gathering</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Start Time*</label>
          <input type="text" className="form-input" placeholder="10:00 AM" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input type="text" className="form-input" placeholder="04:00 PM" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Location / Venue*</label>
          <input type="text" className="form-input" placeholder="Main Seminar Hall" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Maximum Capacity</label>
          <input type="number" className="form-input" placeholder="Unlimited" value={capacity} onChange={(e) => setCapacity(e.target.value === "" ? "" : Number(e.target.value))} min={1} />
        </div>
      </div>

      {category === "sig" && (
        <div className="form-group">
          <label className="form-label">Associated SIG</label>
          <select className="custom-select" value={sigId} onChange={(e) => setSigId(e.target.value)}>
            <option value="">Select SIG</option>
            {sigs.map((sig: any) => (
              <option key={sig._id} value={sig._id}>{sig.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Resource Person / Guest Speaker</div>
        <ImageUpload value={rpImageUrl} onChange={setRpImageUrl} label="Speaker Image" ratioText="Square speaker photo recommended" />
        <div className="form-group" style={{ marginTop: "12px" }}>
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" placeholder="Dr. Jane Smith" value={rpName} onChange={(e) => setRpName(e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
          <div className="form-group">
            <label className="form-label">Designation</label>
            <input type="text" className="form-input" placeholder="Senior Research Scientist" value={rpDesignation} onChange={(e) => setRpDesignation(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Organization</label>
            <input type="text" className="form-input" placeholder="Google DeepMind" value={rpOrganization} onChange={(e) => setRpOrganization(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Event Description*</label>
        <textarea className="form-input" placeholder="Provide detailed information..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} style={{ resize: "vertical", fontFamily: "var(--font-family)", fontSize: "14px" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Registration Status</label>
          <select className="custom-select" value={registrationStatus} onChange={(e) => setRegistrationStatus(e.target.value as any)}>
            <option value="upcoming">Upcoming (Not Open)</option>
            <option value="open">Open</option>
            <option value="full">Full / Waitlisted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center", marginTop: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ width: "16px", height: "16px" }} />
            Featured Event
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{ width: "16px", height: "16px" }} />
            Publish Live
          </label>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : "Save Event"}</button>
      </div>
    </form>
  );
}
