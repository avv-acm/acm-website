import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

interface ToastContextType {
  toast: (type: Toast["type"], title: string, message: string) => void;
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  warning: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type: Toast["type"], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    // Auto dismiss after 5s
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const success = useCallback((title: string, message: string) => toast("success", title, message), [toast]);
  const error = useCallback((title: string, message: string) => toast("error", title, message), [toast]);
  const warning = useCallback((title: string, message: string) => toast("warning", title, message), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`custom-toast ${t.type}`}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", width: "100%" }}>
              <div style={{ marginTop: "2px" }}>
                {t.type === "success" && <CheckCircle2 size={18} color="#34c759" />}
                {t.type === "error" && <AlertCircle size={18} color="#ff453a" />}
                {t.type === "warning" && <AlertTriangle size={18} color="#ff9f0a" />}
                {t.type === "info" && <AlertCircle size={18} color="var(--accent)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
                  {t.title}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {t.message}
                </div>
              </div>
              <button 
                onClick={() => removeToast(t.id)}
                style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: "2px" }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
