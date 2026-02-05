"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { env } from "@/src/lib/env";

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export type AuthUser = {
  id: string;
  name?: string | null;
  email: string;
  role: UserRole;
  isBanned?: boolean;
  emailVerified?: boolean;
  image?: string | null;
};

type AuthSession = {
  user?: AuthUser | null;
  session?: unknown;
} | null;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: "CUSTOMER" | "SELLER" }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      // Backend returns Better Auth session payload: { user, session }
      const res = await apiFetch<{ success: boolean; data: AuthSession }>("/api/v1/auth/me", {
        method: "GET",
      });
      setUser(res?.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      await apiFetch("/api/v1/auth/login", { method: "POST", json: payload });
      await refresh();
    },
    [refresh]
  );

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; role: "CUSTOMER" | "SELLER" }) => {
      await apiFetch("/api/v1/auth/register", { method: "POST", json: payload });
      // Requirement: after registering, user must login manually.
      // Some auth providers may auto-create a session; call logout to ensure no active session.
      try {
        await apiFetch("/api/v1/auth/logout", { method: "POST" });
      } catch {
        // ignore
      }
      setUser(null);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setUser(null);
      // if user is on protected routes, bring them home
      if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/checkout") || pathname?.startsWith("/profile")) {
        router.push("/");
      }
    }
  }, [pathname, router]);

  const loginWithGoogle = useCallback(() => {
    const callbackURL = `${env.appUrl}/auth/callback`;
    // Backend route you set up; this should redirect to Google then back to backend, then to callbackURL.
    window.location.href = `${env.apiBaseUrl}/api/v1/auth/google?callbackURL=${encodeURIComponent(callbackURL)}`;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, refresh, login, register, logout, loginWithGoogle }),
    [user, isLoading, refresh, login, register, logout, loginWithGoogle]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
