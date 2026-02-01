"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { RequireRole } from "@/src/components/shared/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = { id: string; name: string };
type Medicine = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  manufacturer?: string | null;
  imageUrl?: string | null;
  categoryId?: string | null;
  isActive: boolean;
};

export default function EditMedicinePage() {
  return (
    <RequireRole role={["SELLER", "ADMIN"]}>
      <EditMedicineInner />
    </RequireRole>
  );
}

function EditMedicineInner() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [m, setM] = useState<Medicine | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      apiFetch<{ success: boolean; data: Medicine }>(`/api/v1/medicines/${id}`),
      apiFetch<{ success: boolean; data: Category[] }>("/api/v1/categories").catch(() => ({ success: true, data: [] as Category[] })),
    ])
      .then(([medRes, catRes]) => {
        if (!mounted) return;
        setM(medRes.data);
        setCategories(catRes.data || []);
      })
      .catch((e: any) => mounted && setError(e?.message || "Failed to load medicine"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!m) return;
    setError(null);
    setSaving(true);
    try {
      await apiFetch(`/api/v1/medicines/${id}`, {
        method: "PATCH",
        json: {
          name: m.name,
          description: m.description || undefined,
          price: Number(m.price),
          stock: Number(m.stock),
          manufacturer: m.manufacturer || undefined,
          imageUrl: m.imageUrl || undefined,
          categoryId: m.categoryId || undefined,
          isActive: m.isActive,
        },
      });
      router.push("/dashboard/medicines");
    } catch (err: any) {
      setError(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
  if (!m) return <div className="text-sm text-gray-600">Medicine not found.</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit medicine</h1>
          <p className="text-sm text-gray-600 mt-1">Update your medicine details.</p>
        </div>
        <Link href="/dashboard/medicines"><Button variant="outline">Back</Button></Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>
          )}

          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input value={m.description || ""} onChange={(e) => setM({ ...m, description: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Price</Label>
                <Input value={String(m.price)} onChange={(e) => setM({ ...m, price: Number(e.target.value || 0) })} />
              </div>
              <div className="space-y-1">
                <Label>Stock</Label>
                <Input value={String(m.stock)} onChange={(e) => setM({ ...m, stock: Number(e.target.value || 0) })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Manufacturer</Label>
                <Input value={m.manufacturer || ""} onChange={(e) => setM({ ...m, manufacturer: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Image URL</Label>
                <Input value={m.imageUrl || ""} onChange={(e) => setM({ ...m, imageUrl: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                value={m.categoryId || ""}
                onChange={(e) => setM({ ...m, categoryId: e.target.value || null })}
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={m.isActive}
                onChange={(e) => setM({ ...m, isActive: e.target.checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <Button disabled={saving} className="w-full">{saving ? "Saving..." : "Save changes"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
