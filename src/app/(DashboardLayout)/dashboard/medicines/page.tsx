"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";
import { useAuth } from "@/src/providers/auth-provider";
import { RequireRole } from "@/src/components/shared/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Medicine = {
  id: string;
  name: string;
  imageUrl?: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  category?: { name: string };
  sellerId?: string;
};

export default function DashboardMedicinesPage() {
  return (
    <RequireRole role={["SELLER", "ADMIN"]}>
      <MedicinesInner />
    </RequireRole>
  );
}

function MedicinesInner() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Medicine[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        // Prefer a dedicated mine endpoint if your backend has it
        const res = await apiFetch<{ success: boolean; data: Medicine[] }>("/api/v1/medicines/mine");
        if (mounted) setItems(res.data || []);
      } catch {
        try {
          const res = await apiFetch<{ success: boolean; data: Medicine[] }>("/api/v1/medicines");
          if (mounted) setItems(res.data || []);
        } catch (e: any) {
          if (mounted) setError(e?.message || "Failed to load medicines");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = items;
    if (user?.role === "SELLER" && user?.id) {
      list = list.filter((m) => !m.sellerId || m.sellerId === user.id);
    }
    if (!s) return list;
    return list.filter((m) => [m.name, m.category?.name].some((v) => (v || "").toLowerCase().includes(s)));
  }, [items, q, user]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicines</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your product inventory.</p>
        </div>
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-56 bg-white" />
          {user?.role === "SELLER" && (
            <Link href="/dashboard/medicines/new">
              <Button>Add Medicine</Button>
            </Link>
          )}

        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium text-gray-900">No medicines found</p>
            <p className="text-sm text-gray-600 mt-1">Add your first product.</p>
            {user?.role === "SELLER" && (
              <Link href="/dashboard/medicines/new">
                <Button>Add Medicine</Button>
              </Link>
            )}

          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <Card key={m.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="relative h-9 w-9 rounded-md border bg-white overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.imageUrl || "https://placehold.co/100x100?text=M"}
                        alt={m.name}
                        className="h-full w-full object-contain p-1"
                      />
                    </span>
                    <span>{m.name}</span>
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${m.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {m.isActive ? "Active" : "Inactive"}
                  </span>
                </CardTitle>
                <p className="text-xs text-gray-500">{m.category?.name || "Uncategorized"}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Price</span><span className="font-medium">৳{m.price}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Stock</span><span className="font-medium">{m.stock}</span></div>
                <Link href={`/dashboard/medicines/${m.id}`}>
                  <Button variant="outline" className="mt-2">Edit</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
