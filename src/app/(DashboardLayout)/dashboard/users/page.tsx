"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/src/lib/api";
import { RequireRole } from "@/src/components/shared/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type User = { id: string; name?: string | null; email: string; role: string; isBanned?: boolean };

export default function AdminUsersPage() {
  return (
    <RequireRole role={"ADMIN"}>
      <UsersInner />
    </RequireRole>
  );
}

function UsersInner() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    apiFetch<{ success: boolean; data: User[] }>("/api/v1/admin/users")
      .then((res) => setUsers(res.data || []))
      .catch((e: any) => setError(e?.message || "Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleBan = async (id: string, isBanned: boolean) => {
    setSaving(id);
    try {
      await apiFetch(`/api/v1/admin/users/${id}`, { method: "PATCH", json: { isBanned } });
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to update user");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-600 mt-1">Ban/unban users and review roles.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : (
        <div className="grid gap-3">
          {users.map((u) => (
            <Card key={u.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{u.name || u.email}</span>
                  <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700">{u.role}</span>
                </CardTitle>
                <p className="text-xs text-gray-500">{u.email}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className={`text-sm ${u.isBanned ? "text-red-600" : "text-emerald-600"}`}>
                  {u.isBanned ? "Banned" : "Active"}
                </span>
                <Button
                  variant={u.isBanned ? "outline" : "destructive"}
                  disabled={saving === u.id}
                  onClick={() => toggleBan(u.id, !u.isBanned)}
                >
                  {u.isBanned ? "Unban" : "Ban"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
