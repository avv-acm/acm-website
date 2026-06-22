import React, { useState } from "react";
import { Upload, X, Link } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  ratioText?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  ratioText = "Recommended ratio 1:1, max 2MB",
}: ImageUploadProps) {
  const [useUrl, setUseUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      setUseUrl(false);
      setTempUrl("");
    }
  };

  return (
    <div className="form-group" style={{ textAlign: "left" }}>
      <label className="form-label">{label}</label>

      {value ? (
        <div className="uploaded-preview-container">
          <img src={value} alt="Preview" className="uploaded-preview-image" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="remove-upload-btn"
          >
            <X size={14} />
          </button>
        </div>
      ) : useUrl ? (
        <form onSubmit={handleUrlSubmit} style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="form-input"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>
              Add
            </button>
          </div>
          <button
            type="button"
            className="btn-link"
            onClick={() => setUseUrl(false)}
            style={{ fontSize: "12px", textAlign: "left", background: "none", border: "none" }}
          >
            Or upload a local file
          </button>
        </form>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label className="image-upload-zone">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Upload size={24} color="var(--text-tertiary)" />
            <div style={{ fontSize: "14px", fontWeight: 600 }}>Choose a file</div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{ratioText}</div>
          </label>
          <button
            type="button"
            className="btn-link"
            onClick={() => setUseUrl(true)}
            style={{ fontSize: "12px", textAlign: "left", background: "none", border: "none" }}
          >
            <Link size={12} style={{ marginRight: "4px" }} /> Or enter an image URL
          </button>
        </div>
      )}
    </div>
  );
}
