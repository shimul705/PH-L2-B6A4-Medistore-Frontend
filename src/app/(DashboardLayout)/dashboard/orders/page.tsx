"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";
import { useAuth } from "@/src/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: string;
  status: string;
  total: string | number;
  createdAt: string;
  customer?: { name?: string | null; email?: string };
  items: any;
};

const STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default function DashboardOrdersPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    apiFetch<{ success: boolean; data: Order[] }>("/api/v1/orders")
      .then((res) => setOrders(res.data || []))
      .catch((e: any) => setError(e?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canUpdate = user?.role === "SELLER" || user?.role === "ADMIN";

  const updateStatus = async (id: string, status: string) => {
    setSaving(id);
    try {
      await apiFetch(`/api/v1/orders/${id}/status`, { method: "PATCH", json: { status } });
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to update status");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            {user?.role === "CUSTOMER" ? "Your orders" : "Orders relevant to you"}
          </p>
        </div>
        <Link href="/shop"><Button variant="outline">Shop</Button></Link>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium text-gray-900">No orders found</p>
            <p className="text-sm text-gray-600 mt-1">Place an order from the shop.</p>
            <Link href="/shop"><Button className="mt-4">Browse medicines</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Order #{o.id.slice(-6)}</span>
                  <Badge variant="secondary">{o.status}</Badge>
                </CardTitle>
                {user?.role !== "CUSTOMER" && (
                  <p className="text-xs text-gray-500">Customer: {o.customer?.name || o.customer?.email || "—"}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">৳{String(o.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{new Date(o.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/dashboard/orders/${o.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Details</Button>
                  </Link>
                  {canUpdate && (
                    <select
                      className="flex-1 border rounded-md px-2 py-2 text-sm bg-white"
                      value={o.status}
                      disabled={saving === o.id}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
