import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import EventForm from "./EventForm";
import { loadEvents, saveEvents, auditLog } from "../../lib/db";
import { Plus, Edit2, Trash2, Calendar, Eye, EyeOff, Users } from "lucide-react";

export default function EventList() {
  const { success, error } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  useEffect(() => {
    setEvents(loadEvents());
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const q = search.toLowerCase();
      const matchSearch = !q || (ev.title || "").toLowerCase().includes(q) || (ev.location || "").toLowerCase().includes(q) || (ev.description || ev.desc || "").toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || ev.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [events, search, categoryFilter]);

  const handleAdd = () => { setEditingEvent(null); setIsFormOpen(true); };
  const handleEdit = (event: any) => { setEditingEvent(event); setIsFormOpen(true); };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this event? All associated data will be removed.")) return;
    const updated = loadEvents().filter((ev) => ev._id !== id);
    saveEvents(updated);
    auditLog("DELETE_EVENT", "events", `Deleted event ${id}`, "warning");
    success("Event Deleted", "Successfully removed event record.");
    refresh();
  };

  const handleTogglePublish = (id: string, currentPublished: boolean) => {
    const all = loadEvents();
    const updated = all.map((ev) => ev._id === id ? { ...ev, published: !currentPublished } : ev);
    saveEvents(updated);
    auditLog("TOGGLE_PUBLISH", "events", `${!currentPublished ? "Published" : "Unpublished"} event ${id}`, "info");
    success(!currentPublished ? "Event Published" : "Event Un-published", !currentPublished ? "The event is now visible to the public." : "The event is now hidden.");
    refresh();
  };

  const columns = [
    {
      key: "bannerImageUrl", header: "Banner",
      render: (row: any) => (
        <div style={{ width: "60px", height: "40px", borderRadius: "4px", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {row.bannerImageUrl ? <img src={row.bannerImageUrl} alt={row.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}><Calendar size={14} /></div>
          )}
        </div>
      ),
    },
    { key: "title", header: "Title", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "date", header: "Date", sortable: true },
    { key: "location", header: "Location" },
    {
      key: "registrationStatus", header: "Registration",
      render: (row: any) => <span className={`status-badge ${row.registrationStatus || "upcoming"}`}>{row.registrationStatus || "upcoming"}</span>,
    },
    {
      key: "published", header: "Visibility",
      render: (row: any) => (
        <span style={{ fontSize: "11px", fontWeight: 600, color: row.published ? "#34c759" : "var(--text-secondary)" }}>
          {row.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (row: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleTogglePublish(row._id, row.published)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }} title={row.published ? "Unpublish" : "Publish"}>
            {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => handleEdit(row)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px" }} title="Edit">
            <Edit2 size={14} />
          </button>
          <button onClick={() => handleDelete(row._id)} className="btn btn-secondary" style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-panel">
        <div className="table-controls">
          <div className="search-input-wrapper">
            <input type="text" placeholder="Search by event title, location..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="filter-actions">
            <select className="custom-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="hackathon">Hackathons</option>
              <option value="workshop">Workshops</option>
              <option value="sig">SIG Events</option>
              <option value="seminar">Seminars</option>
              <option value="social">Socials</option>
              <option value="other">Other</option>
            </select>
            <button onClick={handleAdd} className="btn btn-primary"><Plus size={16} /> Create Event</button>
          </div>
        </div>
        <DataTable columns={columns} data={filteredEvents} loading={false} getRowId={(row: any) => row._id} pageSize={10} />
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingEvent ? "Edit Event Details" : "Create New Event"} maxWidth="600px">
        <EventForm
          event={editingEvent}
          onSuccess={() => {
            setIsFormOpen(false);
            success(editingEvent ? "Event Updated" : "Event Created", `Successfully ${editingEvent ? "saved" : "created"} event.`);
            refresh();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
