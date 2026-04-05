"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple credentials — change these as needed
const ADMIN_USER = "admin";
const ADMIN_PASS = "threadco@123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (username: string, password: string) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
