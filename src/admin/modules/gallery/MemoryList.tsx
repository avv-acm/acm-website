import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import MemoryForm from "./MemoryForm";
import { loadGallery, saveGallery, loadEvents, auditLog } from "../../lib/db";
import { Plus, Edit2, Trash2, Image as ImageIcon, Eye, EyeOff, Film } from "lucide-react";

export default function MemoryList() {
  const { success, error } = useToast();

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<any>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMemories(loadGallery());
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);
  const events = loadEvents();

  const resolvedMemories = useMemo(() => {
    let result = memories.map((m: any) => {
      const ev = events.find((e: any) => e._id === m.eventId);
      return { ...m, eventTitle: ev ? ev.title : "Standalone Memory", eventDate: ev ? ev.date : "" };
    });
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m: any) =>
        (m.title || "").toLowerCase().includes(q) ||
        (m.eventTitle || "").toLowerCase().includes(q) ||
        (m.summary || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [memories, events, search]);

  const handleAdd = () => { setEditingMemory(null); setIsFormOpen(true); };
  const handleEdit = (memory: any) => { setEditingMemory(memory); setIsFormOpen(true); };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this memory gallery record?")) return;
    const updated = loadGallery().filter((m: any) => m._id !== id);
    saveGallery(updated);
    auditLog("DELETE_MEMORY", "gallery", `Deleted memory ${id}`, "warning");
    success("Memory Deleted", "The memory record has been removed.");
    refresh();
  };

  const handleTogglePublish = (id: string, currentPublishedState: boolean) => {
    const all = loadGallery();
    const updated = all.map((m: any) => m._id === id ? { ...m, published: !currentPublishedState } : m);
    saveGallery(updated);
    auditLog("TOGGLE_MEMORY_PUBLISH", "gallery", `${!currentPublishedState ? "Published" : "Unpublished"} memory ${id}`, "info");
    success(!currentPublishedState ? "Memory Published" : "Memory Unpublished", `Gallery memory is now ${!currentPublishedState ? "live" : "draft"}.`);
    refresh();
  };

  const columns = [
    {
      key: "photoPreview", header: "Preview",
      render: (row: any) => (
        <div style={{ width: "60px", height: "40px", borderRadius: "4px", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {row.photos && row.photos[0] ? (
            <img src={row.photos[0]} alt={row.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}><ImageIcon size={14} /></div>
          )}
        </div>
      ),
    },
    { key: "title", header: "Memory Title", sortable: true },
    { key: "eventTitle", header: "Associated Event", sortable: true },
    {
      key: "mediaCount", header: "Media Assets",
      render: (row: any) => (
        <span style={{ fontSize: "12px", display: "inline-flex", gap: "8px", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}><ImageIcon size={12} style={{ color: "var(--accent)" }} />{row.photos?.length || 0} Photos</span>
          {row.videoUrl && <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", color: "#34c759" }}><Film size={12} />Video</span>}
        </span>
      ),
    },
    {
      key: "published", header: "Status",
      render: (row: any) => <span className={`status-badge ${row.published ? "active" : "inactive"}`}>{row.published ? "Published" : "Draft"}</span>,
    },
    {
      key: "actions", header: "Actions",
      render: (row: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleTogglePublish(row._id, row.published)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }} title={row.published ? "Unpublish" : "Publish"}>
            {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => handleEdit(row)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }} title="Edit"><Edit2 size={14} /></button>
          <button onClick={() => handleDelete(row._id)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }} title="Delete"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-panel">
        <div className="table-controls">
          <div className="search-input-wrapper">
            <input type="text" placeholder="Search memories by title or event..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="filter-actions">
            <button onClick={handleAdd} className="btn btn-primary"><Plus size={16} /> Create Memory Record</button>
          </div>
        </div>
        <DataTable columns={columns} data={resolvedMemories} loading={false} getRowId={(row: any) => row._id} pageSize={10} />
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingMemory ? "Edit Gallery Memory" : "Create Gallery Memory"} maxWidth="650px">
        <MemoryForm
          memory={editingMemory}
          onSuccess={() => {
            setIsFormOpen(false);
            success(editingMemory ? "Memory Updated" : "Memory Created", `Successfully ${editingMemory ? "saved" : "created"} gallery memory.`);
            refresh();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
