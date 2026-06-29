import React, { useState } from "react";
import {
  Palette,
  Code2,
  BookOpen,
  Smartphone,
  Globe,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Tag,
  Link2,
  Save,
  ChevronRight
} from "lucide-react";

// ─── Icon picker map ───────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { key: "palette", label: "Palette", Icon: Palette },
  { key: "code2", label: "Code", Icon: Code2 },
  { key: "book-open", label: "Book", Icon: BookOpen },
  { key: "smartphone", label: "Phone", Icon: Smartphone },
  { key: "globe", label: "Globe", Icon: Globe },
  { key: "file-text", label: "Docs", Icon: FileText },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  palette: Palette,
  code2: Code2,
  "book-open": BookOpen,
  smartphone: Smartphone,
  globe: Globe,
  "file-text": FileText,
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Resource {
  id: string;
  icon: string;
  title: string;
  description: string;
  linkLabel: string;
  linkUrl: string;
  tag: string;
  createdAt: string;
}

const STORAGE_KEY = "acm_admin_resources";

function loadResources(): Resource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: "res-1",
      icon: "palette",
      title: "ACM UI/UX Design Kits",
      description: "Official design systems, wireframes, and dashboard templates matching Apple HIG for student designers.",
      linkLabel: "Open Community Template",
      linkUrl: "https://figma.com",
      tag: "FIGMA & SKETCH",
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-2",
      icon: "code2",
      title: "Vite & React Core Templates",
      description: "Production-grade starting boilerplates, lint configurations, and folder structures for hackathons.",
      linkLabel: "Clone GitHub Repository",
      linkUrl: "https://github.com",
      tag: "REACT & VITE",
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-3",
      icon: "book-open",
      title: "Workshop & Lecture Library",
      description: "Interactive slides, notebook source codes, and recorded live session archives from past workshops.",
      linkLabel: "Browse Library",
      linkUrl: "#",
      tag: "LECTURES",
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-4",
      icon: "smartphone",
      title: "Device Presentation Bezels",
      description: "Beautiful responsive mockups (iPhone, MacBook, iPad) for presenting student projects professionally.",
      linkLabel: "Download Assets",
      linkUrl: "#",
      tag: "MOCKUPS",
      createdAt: new Date().toISOString(),
    },
  ];
}

function saveResources(resources: Resource[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

// ─── Empty form ────────────────────────────────────────────────────────────────
const emptyForm = (): Omit<Resource, "id" | "createdAt"> => ({
  icon: "code2",
  title: "",
  description: "",
  linkLabel: "",
  linkUrl: "",
  tag: "",
});

// ─── ResourceCard ──────────────────────────────────────────────────────────────
function ResourceCard({
  resource,
  onEdit,
  onDelete,
}: {
  resource: Resource;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const IconComp = iconMap[resource.icon] || Code2;

  return (
    <div className="resource-card">
      <div className="resource-card-icon-wrap">
        <IconComp size={20} />
      </div>
      <h3 className="resource-card-title">{resource.title}</h3>
      <p className="resource-card-desc">{resource.description}</p>
      <div className="resource-card-footer">
        <a
          href={resource.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="resource-card-link"
        >
          {resource.linkLabel} <ChevronRight size={13} style={{ display: "inline" }} />
        </a>
        {resource.tag && (
          <span className="resource-card-tag">{resource.tag}</span>
        )}
      </div>
      <div className="resource-card-actions">
        <button
          onClick={onEdit}
          className="btn-link"
          style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", color: "var(--accent)" }}
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="btn-link"
          style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", color: "#ff453a" }}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}

// ─── ResourceForm Modal ────────────────────────────────────────────────────────
function ResourceFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial: Omit<Resource, "id" | "createdAt">;
  onSave: (data: Omit<Resource, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...initial });

  const set = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "32px",
          width: "100%",
          maxWidth: "520px",
          animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
            {initial.title ? "Edit Resource" : "Add New Resource"}
          </h3>
          <button onClick={onClose} className="btn-link" style={{ color: "var(--text-secondary)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Icon Picker */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", display: "block" }}>
              Icon
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {ICON_OPTIONS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("icon", key)}
                  title={label}
                  style={{
                    width: "40px", height: "40px",
                    borderRadius: "10px",
                    border: form.icon === key ? "2px solid var(--accent)" : "1px solid var(--border)",
                    background: form.icon === key ? "rgba(var(--accent-rgb),0.12)" : "var(--bg-elevated)",
                    color: form.icon === key ? "var(--accent)" : "var(--text-secondary)",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Title *
            </label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. ACM UI/UX Design Kits"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Description
            </label>
            <textarea
              className="form-input"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of this resource..."
              rows={3}
              style={{ resize: "vertical", fontFamily: "var(--font-family)" }}
            />
          </div>

          {/* Link */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Link Label
              </label>
              <input
                className="form-input"
                value={form.linkLabel}
                onChange={(e) => set("linkLabel", e.target.value)}
                placeholder="Open Community Template"
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Link URL
              </label>
              <input
                className="form-input"
                value={form.linkUrl}
                onChange={(e) => set("linkUrl", e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>

          {/* Tag */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Category Tag
            </label>
            <input
              className="form-input"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value.toUpperCase())}
              placeholder="e.g. FIGMA & SKETCH"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <Save size={15} /> Save Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main ResourceList ─────────────────────────────────────────────────────────
export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>(() => loadResources());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInit, setFormInit] = useState(emptyForm());

  const persist = (updated: Resource[]) => {
    setResources(updated);
    saveResources(updated);
  };

  const handleAdd = () => {
    setFormInit(emptyForm());
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const r = resources.find((x) => x.id === id);
    if (!r) return;
    setFormInit({ icon: r.icon, title: r.title, description: r.description, linkLabel: r.linkLabel, linkUrl: r.linkUrl, tag: r.tag });
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this resource?")) return;
    persist(resources.filter((r) => r.id !== id));
  };

  const handleSave = (data: Omit<Resource, "id" | "createdAt">) => {
    if (editingId) {
      persist(resources.map((r) => r.id === editingId ? { ...r, ...data } : r));
    } else {
      const newRes: Resource = {
        ...data,
        id: "res-" + Date.now(),
        createdAt: new Date().toISOString(),
      };
      persist([...resources, newRes]);
    }
    setShowForm(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "6px" }}>
          ACM Chapter Assets
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Design &amp; Development Resources
          </h2>
          <button
            onClick={handleAdd}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", padding: "8px 16px" }}
          >
            <Plus size={16} /> Add Resource
          </button>
        </div>
      </div>

      {/* Grid */}
      {resources.length === 0 ? (
        <div style={{
          padding: "60px", textAlign: "center",
          color: "var(--text-tertiary)", fontSize: "14px",
          border: "1px dashed var(--border)", borderRadius: "16px"
        }}>
          No resources yet. Click "Add Resource" to get started.
        </div>
      ) : (
        <div className="resources-grid">
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onEdit={() => handleEdit(r.id)}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ResourceFormModal
          initial={formInit}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Inline styles for resource components */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .resource-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .resource-card:hover {
          border-color: var(--border-focus);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        }
        .resource-card-icon-wrap {
          width: 40px; height: 40px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .resource-card:hover .resource-card-icon-wrap {
          background: rgba(var(--accent-rgb), 0.1);
          color: var(--accent);
          border-color: rgba(var(--accent-rgb), 0.3);
        }
        .resource-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          margin: 0;
        }
        .resource-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }
        .resource-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 4px;
        }
        .resource-card-link {
          font-size: 13px;
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
          display: flex; align-items: center; gap: 2px;
          transition: color 0.4s ease;
        }
        .resource-card-link:hover { color: var(--accent-hover); }
        .resource-card-tag {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 3px 7px;
          white-space: nowrap;
        }
        .resource-card-actions {
          display: flex;
          gap: 12px;
          padding-top: 8px;
          border-top: 1px solid var(--border);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
