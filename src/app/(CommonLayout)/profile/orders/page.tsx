"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";
import { RequireAuth } from "@/src/components/shared/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  status: string;
  total: string | number;
  createdAt: string;
  items: any;
};

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersInner />
    </RequireAuth>
  );
}

function OrdersInner() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiFetch<{ success: boolean; data: Order[] }>("/api/v1/orders")
      .then((res) => mounted && setOrders(res.data || []))
      .catch((e: any) => mounted && setError(e?.message || "Failed to load orders"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-600 mt-1">Track your recent purchases.</p>
          </div>
          <Link href="/shop"><Button variant="outline">Shop</Button></Link>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="font-medium text-gray-900">No orders yet</p>
              <p className="text-sm text-gray-600 mt-1">Place your first order from the shop.</p>
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
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-1">
                      {o.status}
                    </span>
                  </CardTitle>
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
                  <Link href={`/dashboard/orders/${o.id}`} className="inline-block">
                    <Button variant="outline" className="mt-2">View details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
