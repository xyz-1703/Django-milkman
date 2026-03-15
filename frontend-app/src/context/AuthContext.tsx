import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_BASE_URL } from "@/lib/api";

type Role = "customer" | "staff" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  contactNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, requiredRole?: Role) => Promise<boolean>;
  registerCustomer: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_STORAGE_KEY = "dairyfresh_auth_user";
const AUTH_TOKEN_STORAGE_KEY = "dairyfresh_auth_token";

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

const mapApiUser = (apiUser: {
  id: number | string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  contact_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
}): User => {
  const fullName = `${apiUser.first_name || ""} ${apiUser.last_name || ""}`.trim();
  return {
    id: String(apiUser.id),
    name: fullName || apiUser.username,
    email: apiUser.email,
    role: apiUser.role,
    contactNumber: apiUser.contact_number || "",
    addressLine1: apiUser.address_line1 || "",
    addressLine2: apiUser.address_line2 || "",
    city: apiUser.city || "",
    state: apiUser.state || "",
    pincode: apiUser.pincode || "",
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const saveAuth = (nextUser: User, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken);
  };

  const login = async (email: string, password: string, requiredRole?: Role): Promise<boolean> => {
    try {
      const endpoint = requiredRole === "admin" ? "admin-login" : "login";
      const response = await fetch(`${API_BASE_URL}/users/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      const mappedUser = mapApiUser(data.user);
      if (requiredRole && mappedUser.role !== requiredRole) {
        return false;
      }

      saveAuth(mappedUser, data.token);
      return true;
    } catch {
      return false;
    }
  };

  const registerCustomer = async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();
    const [firstName, ...restName] = normalizedName.split(" ");

    try {
      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: normalizedEmail,
          email: normalizedEmail,
          password,
          first_name: firstName || normalizedEmail,
          last_name: restName.join(" "),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const firstError = Object.values(data)[0];
        const message = Array.isArray(firstError) ? String(firstError[0]) : "Registration failed.";
        return { success: false, message };
      }

      const mappedUser = mapApiUser(data.user);
      saveAuth(mappedUser, data.token);

      return { success: true, message: "Registration successful." };
    } catch {
      return { success: false, message: "Unable to connect to server." };
    }
  };

  const refreshUser = async () => {
    const currentToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Token ${currentToken}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      const mappedUser = mapApiUser(data);
      saveAuth(mappedUser, currentToken);
    } catch {
      // Ignore silent refresh failures; the user can continue with cached profile.
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, registerCustomer, refreshUser, logout, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
