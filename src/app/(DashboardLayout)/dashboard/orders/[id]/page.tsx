"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/src/providers/auth-provider";
import Image from "next/image";

type StoredOrderItem = {
  medicineId: string;
  sellerId: string;
  quantity: number;
  unitPrice: string;
  name?: string;
  imageUrl?: string | null;
};

type OrderReview = {
  id: string;
  text: string;
  createdAt: string;
};

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

  const [review, setReview] = useState<OrderReview | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [savingCancel, setSavingCancel] = useState(false);

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

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") return;
    if (!order) return;
    // Only load review when it can exist
    if (!(order.status === "DELIVERED" || order.status === "CANCELLED")) {
      setReview(null);
      return;
    }
    let mounted = true;
    apiFetch<{ success: boolean; data: OrderReview | null }>(`/api/v1/order-reviews/order/${order.id}`)
      .then((res) => mounted && setReview(res.data || null))
      .catch(() => mounted && setReview(null));
    return () => {
      mounted = false;
    };
  }, [order, user]);

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
        name: i.name ? String(i.name) : undefined,
        imageUrl: typeof i.imageUrl === "string" ? i.imageUrl : null,
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

  const canCustomerCancel = user?.role === "CUSTOMER" && order.status === "PLACED";
  const canReview = user?.role === "CUSTOMER" && (order.status === "DELIVERED" || order.status === "CANCELLED");

  const onCustomerCancel = async () => {
    setError(null);
    setSavingCancel(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Order }>(`/api/v1/orders/${order.id}/cancel`, { method: "PATCH" });
      setOrder(res.data);
    } catch (e: any) {
      setError(e?.message || "Failed to cancel order");
    } finally {
      setSavingCancel(false);
    }
  };

  const onSubmitReview = async () => {
    setError(null);
    if (!reviewText.trim()) {
      setError("Please write a short review.");
      return;
    }
    setSavingReview(true);
    try {
      const prefix = order.status === "DELIVERED" ? "I received my order, " : "My order is canceled, ";
      const text = `${prefix}${reviewText.trim()}`;
      const created = await apiFetch<{ success: boolean; data: OrderReview }>(
        `/api/v1/order-reviews/order/${order.id}`,
        {
          method: "POST",
          json: { text },
        }
      );
      setReview(created.data);
      setReviewText("");
    } catch (e: any) {
      setError(e?.message || "Failed to submit review");
    } finally {
      setSavingReview(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(-6)}</h1>
          <p className="text-sm text-gray-600 mt-1">Status: <span className="font-medium">{order.status}</span></p>
        </div>
        <div className="flex gap-2">
          {canCustomerCancel && (
            <Button
              variant="destructive"
              disabled={savingCancel}
              onClick={onCustomerCancel}
            >
              {savingCancel ? "Cancelling..." : "Cancel order"}
            </Button>
          )}
          <Link href="/dashboard/orders"><Button variant="outline">Back</Button></Link>
        </div>
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
                      <th className="py-2">Medicine</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2">Unit Price</th>
                      <th className="py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((it) => {
                      const unit = Number(it.unitPrice);
                      return (
                        <tr key={`${it.medicineId}-${it.sellerId}`} className="border-b last:border-b-0">
                          <td className="py-2">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-md border bg-white overflow-hidden">
                                <Image
                                  src={it.imageUrl || "https://placehold.co/100x100?text=M"}
                                  alt={it.name || "Medicine"}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 leading-tight">
                                  {it.name || "Medicine"}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">{it.medicineId}</p>
                              </div>
                            </div>
                          </td>
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

      {user?.role === "CUSTOMER" && (
        <Card>
          <CardHeader>
            <CardTitle>Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!canReview ? (
              <div className="bg-zinc-50 border rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium">You can submit a review after the seller marks this order as <span className="font-semibold">Delivered</span> or <span className="font-semibold">Cancelled</span>.</p>
              </div>
            ) : review ? (
              <div className="rounded-lg border p-4 bg-white">
                <p className="text-sm text-gray-900 font-medium">Your review</p>
                <p className="text-sm text-gray-700 mt-1">{review.text}</p>
                <p className="text-xs text-gray-500 mt-2">Submitted: {new Date(review.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  {order.status === "DELIVERED"
                    ? "Write a quick note about your delivery and product quality."
                    : "Tell us what happened with the cancellation (optional details help)."}
                </p>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full min-h-[90px] rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Your review..."
                />
                <Button disabled={savingReview} onClick={onSubmitReview}>
                  {savingReview ? "Submitting..." : "Submit review"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
