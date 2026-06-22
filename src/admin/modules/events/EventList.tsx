import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import EventForm from "./EventForm";
import { Plus, Edit2, Trash2, Calendar, Eye, EyeOff, Users } from "lucide-react";
import RegistrationTrackerModal from "./RegistrationTrackerModal";

export default function EventList() {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [trackerEvent, setTrackerEvent] = useState<any>(null);

  // Queries
  const events = useQuery(
    api.events.listAdmin,
    token ? { token, category: categoryFilter, search } : "skip"
  );

  // Mutations
  const deleteMutation = useMutation(api.events.remove);
  const togglePublishMutation = useMutation(api.events.togglePublish);

  const handleAdd = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("Are you sure you want to delete this event? All associated registrations will be lost.")) return;
    try {
      await deleteMutation({ token: token!, id });
      success("Event Deleted", "Successfully removed event record.");
    } catch (err: any) {
      error("Deletion Failed", err.message || "Could not delete event.");
    }
  };

  const handleTogglePublish = async (id: any, currentPublished: boolean) => {
    try {
      await togglePublishMutation({ token: token!, id, published: !currentPublished });
      success(
        !currentPublished ? "Event Published" : "Event Un-published",
        !currentPublished ? "The event is now visible to the public." : "The event is now hidden."
      );
    } catch (err: any) {
      error("Action Failed", err.message || "Could not toggle published status.");
    }
  };

  const columns = [
    {
      key: "bannerImageUrl",
      header: "Banner",
      render: (row: any) => (
        <div style={{ width: "60px", height: "40px", borderRadius: "4px", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {row.bannerImageUrl ? (
            <img src={row.bannerImageUrl} alt={row.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
              <Calendar size={14} />
            </div>
          )}
        </div>
      ),
    },
    { key: "title", header: "Title", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "date", header: "Date", sortable: true },
    { key: "location", header: "Location" },
    {
      key: "registrationStatus",
      header: "Registration",
      render: (row: any) => (
        <span className={`status-badge ${row.registrationStatus}`}>{row.registrationStatus}</span>
      ),
    },
    {
      key: "published",
      header: "Public Visibility",
      render: (row: any) => (
        <span style={{ 
          fontSize: "11px", 
          fontWeight: 600, 
          color: row.published ? "#34c759" : "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
          {row.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => handleTogglePublish(row._id, row.published)}
            className="btn btn-secondary"
            style={{ padding: "6px", borderRadius: "8px" }}
            title={row.published ? "Unpublish" : "Publish"}
          >
            {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={() => setTrackerEvent(row)}
            className="btn btn-secondary"
            style={{ padding: "6px", borderRadius: "8px" }}
            title="View Registrations"
          >
            <Users size={14} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="btn btn-secondary"
            style={{ padding: "6px", borderRadius: "8px" }}
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="btn btn-secondary"
            style={{ padding: "6px", borderRadius: "8px", color: "#ff453a" }}
            title="Delete"
          >
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
            <input
              type="text"
              placeholder="Search by event title, location, desc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <select
              className="custom-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="hackathon">Hackathons</option>
              <option value="workshop">Workshops</option>
              <option value="sig">SIG Events</option>
              <option value="seminar">Seminars</option>
              <option value="social">Socials</option>
              <option value="other">Other</option>
            </select>

            <button onClick={handleAdd} className="btn btn-primary">
              <Plus size={16} /> Create Event
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={events ?? []}
          loading={!events}
          getRowId={(row: any) => row._id}
          pageSize={10}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingEvent ? "Edit Event Details" : "Create New Event"}
        maxWidth="600px"
      >
        <EventForm
          event={editingEvent}
          onSuccess={() => {
            setIsFormOpen(false);
            success(
              editingEvent ? "Event Updated" : "Event Created",
              `Successfully ${editingEvent ? "saved" : "created"} event schedule.`
            );
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {trackerEvent && (
        <RegistrationTrackerModal
          event={trackerEvent}
          onClose={() => setTrackerEvent(null)}
        />
      )}
    </div>
  );
}
