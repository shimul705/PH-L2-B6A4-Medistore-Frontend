"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/src/lib/api";
import { RequireAuth } from "@/src/components/shared/require-auth";
import { useCart } from "@/src/providers/cart-provider";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  isDefault?: boolean;
};

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutInner />
    </RequireAuth>
  );
}

function CheckoutInner() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState<Address | null>(null);
  const [notes, setNotes] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingAddress(true);
    apiFetch<{ success: boolean; data: Address | null }>("/api/v1/addresses/default")
      .then((res) => mounted && setAddress(res.data || null))
      .catch(() => mounted && setAddress(null))
      .finally(() => mounted && setLoadingAddress(false));
    return () => {
      mounted = false;
    };
  }, []);

  const payload = useMemo(() => {
    return {
      shippingName: address?.name || "",
      shippingPhone: address?.phone || "",
      shippingAddress: address?.address || "",
      shippingCity: address?.city || "",
      notes: notes || undefined,
      items: items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
    };
  }, [address, notes, items]);

  const placeOrder = async () => {
    setError(null);
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!address) {
      setError("Please set a default delivery address before checkout.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/v1/orders", { method: "POST", json: payload });
      clear();
      router.push("/dashboard/orders");
    } catch (err: any) {
      setError(err?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-600 mt-1">Enter delivery details and confirm your order.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Delivery address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingAddress ? (
                <p className="text-sm text-gray-600">Loading your default address...</p>
              ) : !address ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-4">
                  <p className="font-medium">No default address selected.</p>
                  <p className="mt-1">Go to <Link className="underline font-semibold" href="/dashboard/address">Delivery Address</Link> and set one as default to continue checkout.</p>
                </div>
              ) : (
                <div className="rounded-xl border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{address.name}</p>
                      <p className="text-sm text-gray-700">{address.phone}</p>
                      <p className="text-sm text-gray-700 mt-2">{address.address}</p>
                      <p className="text-sm text-gray-700">{address.city}</p>
                    </div>
                    <Link href="/dashboard/address">
                      <Button variant="outline">Change</Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="rounded-xl border bg-white p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Order notes (optional)</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[90px] rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Any delivery notes..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">{items.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">৳0</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">৳{subtotal}</span>
              </div>
              <Button disabled={loading || loadingAddress || !address} className="w-full mt-2" onClick={placeOrder}>
                {loading ? "Placing order..." : "Place order"}
              </Button>
              <p className="text-xs text-gray-500">Payment: Cash on delivery (demo).</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
