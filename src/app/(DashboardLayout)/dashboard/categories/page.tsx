"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/src/lib/api";
import { RequireRole } from "@/src/components/shared/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: string; name: string };

export default function CategoriesPage() {
  return (
    <RequireRole role={"ADMIN"}>
      <CategoriesInner />
    </RequireRole>
  );
}

function CategoriesInner() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    apiFetch<{ success: boolean; data: Category[] }>("/api/v1/categories")
      .then((res) => setItems(res.data || []))
      .catch((e: any) => setError(e?.message || "Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/api/v1/categories", { method: "POST", json: { name } });
      setName("");
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-600 mt-1">Create and manage medicine categories.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Pain Relief" />
          <Button disabled={saving} onClick={create}>{saving ? "Saving..." : "Add"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-gray-600">No categories.</div>
          ) : (
            <ul className="space-y-2">
              {items.map((c) => (
                <li key={c.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{c.id.slice(-6)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
