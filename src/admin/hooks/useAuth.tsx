import { useState, useEffect, createContext, useContext } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("acm_admin_token") || localStorage.getItem("acm_admin_token");
    }
    return null;
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const convex = useConvex();
  const loginMutation = useMutation(api.admin_auth.login);
  const logoutMutation = useMutation(api.admin_auth.logout);
  const changePasswordMutation = useMutation(api.admin_auth.changePassword);

  // Validate token on load or changes
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const result = await convex.query(api.admin_auth.validate, { token });
        if (result.valid && result.user) {
          setUser(result.user as User);
        } else {
          // Token invalid or expired
          handleClearAuth();
        }
      } catch (err) {
        console.error("Token validation error:", err);
        handleClearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, convex]);

  const handleClearAuth = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("acm_admin_token");
      sessionStorage.removeItem("acm_admin_token");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({
        email,
        password,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      });

      if (result && result.token) {
        setToken(result.token);
        setUser(result.user as User);
        if (typeof window !== "undefined") {
          // Store token in sessionStorage for security, but allow transition to localStorage if desired
          sessionStorage.setItem("acm_admin_token", result.token);
        }
      } else {
        throw new Error("Invalid response from auth server");
      }
    } catch (err: any) {
      handleClearAuth();
      throw err;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await logoutMutation({ token });
      } catch (err) {
        console.error("Failed to invalidate session on server:", err);
      }
    }
    handleClearAuth();
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!token) throw new Error("Not authenticated");
    await changePasswordMutation({ token, oldPassword, newPassword });
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
