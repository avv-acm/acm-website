import React, { useState, useMemo } from "react";
import Modal from "../../components/Modal";
import DataTable from "../../components/DataTable";
import { Download, Search, Filter } from "lucide-react";

interface RegistrationTrackerModalProps {
  event: any;
  onClose: () => void;
}

export default function RegistrationTrackerModal({ event, onClose }: RegistrationTrackerModalProps) {
  // Load registrations from localStorage: acm_event_registrations_<eventId>
  const regKey = `acm_event_registrations_${event._id}`;
  const rawReg = localStorage.getItem(regKey);
  const registrations: any[] = rawReg ? JSON.parse(rawReg) : [];

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  // Dynamic filter lists from registrations
  const departments = useMemo(() => {
    if (!registrations) return [];
    const depts = new Set<string>();
    registrations.forEach((r: any) => {
      if (r.member?.department) depts.add(r.member.department);
    });
    return Array.from(depts).sort();
  }, [registrations]);

  const sections = useMemo(() => {
    if (!registrations) return [];
    const secs = new Set<string>();
    registrations.forEach((r: any) => {
      if (r.member?.section) secs.add(r.member.section);
    });
    return Array.from(secs).sort();
  }, [registrations]);

  // Filtered registrations
  const filteredRegs = useMemo(() => {
    if (!registrations) return [];
    return registrations.filter((r: any) => {
      const m = r.member;
      if (!m) return false;

      const matchesSearch = 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.studentId.toLowerCase().includes(search.toLowerCase());

      const matchesYear = yearFilter === "all" || m.year === yearFilter;
      const matchesDept = deptFilter === "all" || m.department === deptFilter;
      const matchesSec = sectionFilter === "all" || m.section === sectionFilter;

      return matchesSearch && matchesYear && matchesDept && matchesSec;
    });
  }, [registrations, search, yearFilter, deptFilter, sectionFilter]);

  // Registration Stats
  const stats = useMemo(() => {
    if (!registrations) return { total: 0, confirmed: 0, waitlisted: 0 };
    return {
      total: registrations.length,
      confirmed: registrations.filter((r: any) => r.status === "confirmed").length,
      waitlisted: registrations.filter((r: any) => r.status === "waitlisted").length,
    };
  }, [registrations]);

  const handleExportCSV = () => {
    if (!filteredRegs || filteredRegs.length === 0) return;
    
    const headers = ["Name", "Email", "Roll Number", "Year", "Department", "Section", "Registered At", "Status"];
    const rows = filteredRegs.map((r: any) => [
      r.member.name,
      r.member.email,
      r.member.studentId,
      r.member.year || "",
      r.member.department || "",
      r.member.section || "",
      new Date(r.registeredAt).toLocaleString(),
      r.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      key: "name",
      header: "Attendee Name",
      sortable: true,
      render: (row: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.member.name}</div>
          <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{row.member.email}</div>
        </div>
      ),
    },
    { key: "studentId", header: "Roll No / Student ID", sortable: true, render: (row: any) => row.member.studentId },
    {
      key: "academic",
      header: "Academic Class",
      render: (row: any) => (
        <span>
          {row.member.year || "N/A"} - {row.member.department || "N/A"} {row.member.section ? `(${row.member.section})` : ""}
        </span>
      ),
    },
    {
      key: "registeredAt",
      header: "Registration Date",
      sortable: true,
      render: (row: any) => new Date(row.registeredAt).toLocaleDateString(undefined, { dateStyle: "medium" }),
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => (
        <span className={`status-badge ${row.status}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Attendee Registrations: ${event.title}`}
      maxWidth="800px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Registration Stats Summary Card */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "16px",
          background: "var(--bg-elevated)", 
          border: "1px solid var(--border)", 
          padding: "16px", 
          borderRadius: "var(--radius-md)" 
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--accent)" }}>{stats.total}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Total Registered</div>
          </div>
          <div style={{ textAlign: "center", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#34c759" }}>{stats.confirmed}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Confirmed Seats</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#ff9500" }}>{stats.waitlisted}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Waitlisted</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px", 
          padding: "16px",
          background: "rgba(255, 255, 255, 0.01)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)"
        }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Search size={16} style={{ color: "var(--text-tertiary)" }} />
            <input
              type="text"
              placeholder="Search attendee name, email or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "var(--text-primary)"
              }}
            />
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <select
                className="custom-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                style={{ minWidth: "130px" }}
              >
                <option value="all">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>

              <select
                className="custom-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                style={{ minWidth: "150px" }}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                className="custom-select"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                style={{ minWidth: "120px" }}
              >
                <option value="all">All Sections</option>
                {sections.map((sec) => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleExportCSV} 
              className="btn btn-secondary" 
              style={{ display: "flex", alignItems: "center", gap: "8px", height: "36px" }}
              disabled={filteredRegs.length === 0}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Attendee Datatable */}
        <DataTable
          columns={columns}
          data={filteredRegs}
          loading={!registrations}
          getRowId={(row: any) => row.registrationId}
          pageSize={8}
        />
      </div>
    </Modal>
  );
}
