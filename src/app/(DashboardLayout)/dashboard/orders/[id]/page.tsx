"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/src/providers/auth-provider";

type StoredOrderItem = { medicineId: string; sellerId: string; quantity: number; unitPrice: string };

type Order = {
  id: string;
  status: string;
  total: string | number;
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingArea?: string | null;
  notes?: string | null;
  customer?: { name?: string | null; email?: string };
  items: unknown;
};

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiFetch<{ success: boolean; data: Order }>(`/api/v1/orders/${id}`)
      .then((res) => mounted && setOrder(res.data))
      .catch((e: any) => mounted && setError(e?.message || "Failed to load order"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const items = useMemo<StoredOrderItem[]>(() => {
    const raw = (order?.items as any) || [];
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((i) => i && typeof i === "object")
      .map((i: any) => ({
        medicineId: String(i.medicineId || ""),
        sellerId: String(i.sellerId || ""),
        quantity: Number(i.quantity || 0),
        unitPrice: String(i.unitPrice || "0"),
      }))
      .filter((i) => i.medicineId && i.quantity > 0);
  }, [order]);

  const visibleItems = useMemo(() => {
    if (user?.role !== "SELLER") return items;
    return items.filter((i) => i.sellerId === user.id);
  }, [items, user]);

  if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>;
  if (!order) return <div className="text-sm text-gray-600">Order not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(-6)}</h1>
          <p className="text-sm text-gray-600 mt-1">Status: <span className="font-medium">{order.status}</span></p>
        </div>
        <Link href="/dashboard/orders"><Button variant="outline">Back</Button></Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
            {user?.role === "SELLER" && (
              <p className="text-xs text-gray-500">Showing only items sold by you.</p>
            )}
          </CardHeader>
          <CardContent>
            {visibleItems.length === 0 ? (
              <p className="text-sm text-gray-600">No items to show.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-2">Medicine ID</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2">Unit Price</th>
                      <th className="py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((it) => {
                      const unit = Number(it.unitPrice);
                      return (
                        <tr key={it.medicineId} className="border-b last:border-b-0">
                          <td className="py-2 font-mono text-xs">{it.medicineId}</td>
                          <td className="py-2">{it.quantity}</td>
                          <td className="py-2">৳{unit}</td>
                          <td className="py-2 font-semibold">৳{unit * it.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {user?.role !== "CUSTOMER" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Customer</span>
                <span className="font-medium">{order.customer?.name || order.customer?.email || "—"}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-gray-600">Name</span><span className="font-medium">{order.shippingName}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Phone</span><span className="font-medium">{order.shippingPhone}</span></div>
            <div className="pt-2">
              <p className="text-gray-600">Address</p>
              <p className="font-medium">{order.shippingAddress}</p>
              <p className="font-medium">{order.shippingCity}{order.shippingArea ? `, ${order.shippingArea}` : ""}</p>
            </div>
            {order.notes && (
              <div className="pt-2">
                <p className="text-gray-600">Notes</p>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">৳{String(order.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
