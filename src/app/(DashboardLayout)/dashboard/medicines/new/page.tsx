"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { RequireRole } from "@/src/components/shared/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = { id: string; name: string };

export default function NewMedicinePage() {
  return (
    <RequireRole role={"SELLER"}>
      <NewMedicineInner />
    </RequireRole>
  );
}

function NewMedicineInner() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [manufacturer, setManufacturer] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    apiFetch<{ success: boolean; data: Category[] }>("/api/v1/categories")
      .then((res) => {
        if (!mounted) return;
        setCategories(res.data || []);
        if ((res.data || []).length > 0) setCategoryId((res.data || [])[0].id);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/v1/medicines", {
        method: "POST",
        json: {
          name,
          description: description || undefined,
          price: Number(price),
          stock: Number(stock),
          manufacturer: manufacturer || undefined,
          imageUrl: imageUrl || undefined,
          categoryId: categoryId || undefined,
        },
      });
      router.push("/dashboard/medicines");
    } catch (err: any) {
      setError(err?.message || "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add medicine</h1>
          <p className="text-sm text-gray-600 mt-1">Create a new medicine in your inventory.</p>
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

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Price *</Label>
                <Input value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Stock *</Label>
                <Input value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Manufacturer</Label>
                <Input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="Optional" />
              </div>
              <div className="space-y-1">
                <Label>Image URL</Label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Optional" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {categories.length === 0 && <option value="">No categories</option>}
              </select>
            </div>

            <Button disabled={loading} className="w-full">
              {loading ? "Saving..." : "Create medicine"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
