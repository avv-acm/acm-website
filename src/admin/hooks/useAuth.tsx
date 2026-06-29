import { useState, useEffect, createContext, useContext } from "react";

// ── Default admin credentials (stored as-is; for production use a hash) ──────
const DEFAULT_ADMINS = [
  {
    id: "sa-001",
    email: "admin@acm.amrita.edu",
    password: "acm@admin2026",
    name: "ACM Administrator",
    role: "super_admin" as const,
  },
  {
    id: "sa-002",
    email: "superadmin@amrita.edu",
    password: "ACM_Super@2026",
    name: "Super Admin",
    role: "super_admin" as const,
  },
];

const ADMINS_KEY = "acm_admin_credentials";
const SESSION_KEY = "acm_admin_token";
const ATTEMPTS_KEY = "acm_admin_login_attempts";
const LOCKOUT_KEY = "acm_admin_lockout_until";

interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Simple token generator ───────────────────────────────────────────────────
function generateToken(userId: string): string {
  return `${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── Load admin list (defaults + any added via admin panel) ───────────────────
function loadAdmins() {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ADMINS;
}

// ── Session store ────────────────────────────────────────────────────────────
function saveSession(token: string, user: User) {
  const session = { token, user, expiresAt: Date.now() + 8 * 60 * 60 * 1000 }; // 8h
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession(): { token: string; user: User } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return { token: session.token, user: session.user };
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setToken(session.token);
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Lockout check
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || "0");
    if (lockoutUntil > Date.now()) {
      const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
      throw new Error(`RATE_LIMITED:${secs}`);
    }

    const admins = loadAdmins();
    const found = admins.find(
      (a: any) =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.password === password
    );

    if (!found) {
      // Track failed attempts
      const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || "0") + 1;
      localStorage.setItem(ATTEMPTS_KEY, String(attempts));
      if (attempts >= 5) {
        const lockUntil = Date.now() + 5 * 60 * 1000; // 5 min lockout
        localStorage.setItem(LOCKOUT_KEY, String(lockUntil));
        localStorage.removeItem(ATTEMPTS_KEY);
        throw new Error("RATE_LIMITED:300");
      }
      throw new Error("AUTH_INVALID_CREDENTIALS");
    }

    // Clear attempts on success
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_KEY);

    const authUser: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
    };
    const tok = generateToken(found.id);
    saveSession(tok, authUser);
    setToken(tok);
    setUser(authUser);
  };

  const logout = async (): Promise<void> => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    if (!user) throw new Error("Not authenticated");
    const admins = loadAdmins();
    const idx = admins.findIndex(
      (a: any) => a.id === user.id && a.password === oldPassword
    );
    if (idx === -1) throw new Error("Old password is incorrect.");
    admins[idx].password = newPassword;
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
