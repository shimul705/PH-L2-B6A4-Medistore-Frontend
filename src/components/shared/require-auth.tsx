"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/src/providers/auth-provider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-10 text-sm text-gray-600">Loading...</div>;
  }

  if (!user) return null;
  return <>{children}</>;
}

export function RequireRole({ role, children }: { role: UserRole | UserRole[]; children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const roles = Array.isArray(role) ? role : [role];

  useEffect(() => {
    if (!isLoading && user && !roles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, roles, router]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-10 text-sm text-gray-600">Loading...</div>;
  }

  if (!user) return null;
  if (!roles.includes(user.role)) return null;
  return <>{children}</>;
}
