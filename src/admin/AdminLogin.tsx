import React, { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "./hooks/useAuth";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // Handle lockout countdown timer
  useEffect(() => {
    if (lockoutTimer === null) return;
    if (lockoutTimer <= 0) {
      setLockoutTimer(null);
      setError(null);
      return;
    }

    const interval = setInterval(() => {
      setLockoutTimer((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Login failure:", err);
      const errMsg = err.message || "";
      if (errMsg.startsWith("RATE_LIMITED:")) {
        const seconds = parseInt(errMsg.split(":")[1], 10) || 300;
        setLockoutTimer(seconds);
        setError(`Too many login attempts. Access locked.`);
      } else if (errMsg.includes("AUTH_INVALID_CREDENTIALS")) {
        setError("Invalid email address or password.");
      } else {
        setError(errMsg || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      fontFamily: "var(--font-family)",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "40px",
        width: "100%",
        maxWidth: "440px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "var(--card-shadow)"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          backgroundColor: "var(--accent)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 0 20px rgba(var(--accent-rgb), 0.3)"
        }}>
          <Shield size={24} />
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
          ACM Administrator
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center", marginBottom: "24px" }}>
          Please authenticate to enter the management portal.
        </p>

        {error && (
          <div style={{
            backgroundColor: "rgba(255, 69, 58, 0.1)",
            border: "1px solid #ff453a",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            color: "#ff453a",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            textAlign: "left",
            marginBottom: "20px"
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              {error}
              {lockoutTimer !== null && (
                <div style={{ fontWeight: 600, marginTop: "4px" }}>
                  Try again in {lockoutTimer}s
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@amrita.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || lockoutTimer !== null}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || lockoutTimer !== null}
                autoComplete="current-password"
                required
                style={{ width: "100%", paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-tertiary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || lockoutTimer !== null}
            style={{ width: "100%", height: "42px", marginTop: "8px" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
