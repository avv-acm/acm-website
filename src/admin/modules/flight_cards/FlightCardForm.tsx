import React, { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import { loadFlightEvents, saveFlightEvents, genId, auditLog } from "../../lib/db";

interface FlightCardFormProps {
  card?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FlightCardForm({ card, onSuccess, onCancel }: FlightCardFormProps) {
  const [bg, setBg] = useState("");
  const [cityName, setCityName] = useState("");
  const [fareClass, setFareClass] = useState("");
  const [priceVal, setPriceVal] = useState("");
  const [airportCode, setAirportCode] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [link, setLink] = useState("");
  const [published, setPublished] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (card) {
      setBg(card.bg || "");
      setCityName(card.cityName || "");
      setFareClass(card.fareClass || "");
      setPriceVal(card.priceVal || "");
      setAirportCode(card.airportCode || "");
      setButtonText(card.buttonText || "");
      setLink(card.link || "");
      setPublished(card.published !== undefined ? card.published : true);
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim() || !fareClass.trim() || !priceVal.trim() || !airportCode.trim() || !buttonText.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = {
      bg: bg || "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
      cityName: cityName.trim(),
      fareClass: fareClass.trim(),
      priceVal: priceVal.trim(),
      airportCode: airportCode.trim().toUpperCase(),
      buttonText: buttonText.trim(),
      link: link.trim() || "/register",
      published,
      likesCount: card ? (card.likesCount || 0) : 0
    };

    try {
      const all = loadFlightEvents();
      if (card) {
        const updated = all.map((c) => c._id === card._id ? { ...c, ...payload } : c);
        saveFlightEvents(updated);
        auditLog("UPDATE_FLIGHT_CARD", "flight_cards", `Updated flight card: ${cityName}`, "info");
      } else {
        const newCard = { _id: genId("flt"), ...payload, createdAt: new Date().toISOString() };
        saveFlightEvents([...all, newCard]);
        auditLog("CREATE_FLIGHT_CARD", "flight_cards", `Created flight card: ${cityName}`, "info");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save flight card information.");
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

      <ImageUpload value={bg} onChange={setBg} label="Card Background Image" ratioText="Tall/Portrait image recommended, max 2MB" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">City / Event Name*</label>
          <input type="text" className="form-input" placeholder="e.g. New York" value={cityName} onChange={(e) => setCityName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Category / Fare Class*</label>
          <input type="text" className="form-input" placeholder="e.g. Economy or Premium Hackathon" value={fareClass} onChange={(e) => setFareClass(e.target.value)} required />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Price / Value*</label>
          <input type="text" className="form-input" placeholder="e.g. $120 or ₹0" value={priceVal} onChange={(e) => setPriceVal(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Airport / Code*</label>
          <input type="text" className="form-input" placeholder="e.g. JFK or ACM" value={airportCode} onChange={(e) => setAirportCode(e.target.value)} required maxLength={5} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Button Text*</label>
          <input type="text" className="form-input" placeholder="e.g. Search flight" value={buttonText} onChange={(e) => setButtonText(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Redirect URL / Link</label>
          <input type="text" className="form-input" placeholder="e.g. /register or https://..." value={link} onChange={(e) => setLink(e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{ width: "16px", height: "16px" }} />
          Publish Live (Visible on Events Page)
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : "Save Card"}</button>
      </div>
    </form>
  );
}
