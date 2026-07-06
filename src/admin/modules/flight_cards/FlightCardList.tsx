import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FlightCardForm from "./FlightCardForm";
import { loadFlightEvents, saveFlightEvents, auditLog } from "../../lib/db";
import { Plus, Edit2, Trash2, Calendar, Eye, EyeOff } from "lucide-react";

export default function FlightCardList() {
  const { success, error } = useToast();

  const [search, setSearch] = useState("");
  const [cards, setCards] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);

  useEffect(() => {
    setCards(loadFlightEvents());
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const q = search.toLowerCase();
      return (
        !q ||
        (card.cityName || "").toLowerCase().includes(q) ||
        (card.fareClass || "").toLowerCase().includes(q) ||
        (card.airportCode || "").toLowerCase().includes(q)
      );
    });
  }, [cards, search]);

  const handleAdd = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };

  const handleEdit = (card: any) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this Flight Card?")) return;
    const updated = loadFlightEvents().filter((c) => c._id !== id);
    saveFlightEvents(updated);
    auditLog("DELETE_FLIGHT_CARD", "flight_cards", `Deleted flight card ${id}`, "warning");
    success("Card Deleted", "Successfully removed flight card.");
    refresh();
  };

  const handleTogglePublish = (id: string, currentPublished: boolean) => {
    const all = loadFlightEvents();
    const updated = all.map((c) => c._id === id ? { ...c, published: !currentPublished } : c);
    saveFlightEvents(updated);
    auditLog("TOGGLE_PUBLISH_FLIGHT_CARD", "flight_cards", `${!currentPublished ? "Published" : "Unpublished"} card ${id}`, "info");
    success(
      !currentPublished ? "Card Published" : "Card Un-published",
      !currentPublished ? "The card is now visible to the public." : "The card is now hidden."
    );
    refresh();
  };

  const columns = [
    {
      key: "bg", header: "Image",
      render: (row: any) => (
        <div style={{ width: "60px", height: "40px", borderRadius: "4px", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {row.bg ? <img src={row.bg} alt={row.cityName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}><Calendar size={14} /></div>
          )}
        </div>
      ),
    },
    { key: "cityName", header: "City / Name", sortable: true },
    { key: "fareClass", header: "Class / Category", sortable: true },
    { key: "airportCode", header: "Code", sortable: true },
    { key: "priceVal", header: "Price" },
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
            <input type="text" placeholder="Search by city, class, code..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="filter-actions">
            <button onClick={handleAdd} className="btn btn-primary"><Plus size={16} /> Create Flight Card</button>
          </div>
        </div>
        <DataTable columns={columns} data={filteredCards} loading={false} getRowId={(row: any) => row._id} pageSize={10} />
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingCard ? "Edit Flight Card Details" : "Create New Flight Card"} maxWidth="600px">
        <FlightCardForm
          card={editingCard}
          onSuccess={() => {
            setIsFormOpen(false);
            success(editingCard ? "Card Updated" : "Card Created", `Successfully ${editingCard ? "saved" : "created"} flight card.`);
            refresh();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
