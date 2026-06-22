import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "500px",
}: ModalProps) {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth, width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} className="modal-close">
            <X size={16} />
          </button>
        </div>
        <div style={{ maxHeight: "calc(80vh - 120px)", overflowY: "auto", paddingRight: "4px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
