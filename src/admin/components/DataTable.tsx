import React, { useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  // Bulk selection
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  getRowId?: (row: T) => string;
  // Pagination
  pageSize?: number;
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  selectedIds = [],
  onSelectionChange,
  getRowId,
  pageSize = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange || !getRowId) return;
    if (e.target.checked) {
      const allIds = data.map((row) => getRowId(row));
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedIds, rowId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== rowId));
    }
  };

  // Sorting handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Process data (sort & paginate)
  const processedData = [...data];
  if (sortKey) {
    processedData.sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === undefined || bVal === undefined) return 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isAllSelected =
    data.length > 0 &&
    getRowId &&
    data.every((row) => selectedIds.includes(getRowId(row)));

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              {onSelectionChange && getRowId && (
                <th style={{ width: "40px", paddingLeft: "24px" }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
              )}
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => col.sortable && handleSort(col.key as string)}
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {col.header}
                    {col.sortable && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading state skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {onSelectionChange && <td style={{ paddingLeft: "24px" }}><div className="skeleton" style={{ width: "16px", height: "16px" }} /></td>}
                  {columns.map((_, j) => (
                    <td key={j}>
                      <div
                        className="skeleton animate-pulse"
                        style={{
                          height: "16px",
                          width: `${Math.random() * 50 + 40}%`,
                          background: "var(--bg-elevated)",
                          borderRadius: "4px",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => {
                const rowId = getRowId ? getRowId(row) : String(i);
                return (
                  <tr key={rowId}>
                    {onSelectionChange && getRowId && (
                      <td style={{ paddingLeft: "24px" }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(rowId)}
                          onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    )}
                    {columns.map((col, j) => (
                      <td key={j}>
                        {col.render
                          ? col.render(row)
                          : String((row as any)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, data.length)} of {data.length} records
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)" }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)" }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
