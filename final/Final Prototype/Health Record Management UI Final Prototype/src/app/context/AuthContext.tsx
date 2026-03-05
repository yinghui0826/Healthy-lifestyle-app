import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  username: string;
  displayName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  register: (username: string, displayName: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const USERS_KEY = "ht_users";
const SESSION_KEY = "ht_session";

// ── Helpers ──────────────────────────────────────────────────────────────────
function getUsers(): Record<string, { passwordHash: string; displayName: string; createdAt: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

// Simple deterministic hash (frontend-only, not for sensitive data)
function hashPassword(password: string): string {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) + hash + password.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  const login = useCallback((username: string, password: string) => {
    const users = getUsers();
    const key = username.toLowerCase().trim();
    const stored = users[key];
    if (!stored) return { success: false, error: "No account found with that username." };
    if (stored.passwordHash !== hashPassword(password)) {
      return { success: false, error: "Incorrect password." };
    }
    const u: User = { username: key, displayName: stored.displayName, createdAt: stored.createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    return { success: true };
  }, []);

  const register = useCallback((username: string, displayName: string, password: string) => {
    const trimmed = username.toLowerCase().trim();
    if (!trimmed || trimmed.length < 3) return { success: false, error: "Username must be at least 3 characters." };
    if (!/^[a-z0-9_]+$/.test(trimmed)) return { success: false, error: "Username can only contain letters, numbers, and underscores." };
    if (!displayName.trim()) return { success: false, error: "Display name is required." };
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };
    const users = getUsers();
    if (users[trimmed]) return { success: false, error: "That username is already taken." };
    users[trimmed] = {
      passwordHash: hashPassword(password),
      displayName: displayName.trim(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const u: User = { username: trimmed, displayName: displayName.trim(), createdAt: users[trimmed].createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
