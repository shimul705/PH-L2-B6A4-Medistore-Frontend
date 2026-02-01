"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/src/lib/api";
import { RequireAuth } from "@/src/components/shared/require-auth";
import { useCart } from "@/src/providers/cart-provider";

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

  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingArea, setShippingArea] = useState("");
  const [notes, setNotes] = useState("");

  const payload = useMemo(() => {
    return {
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingArea: shippingArea || undefined,
      notes: notes || undefined,
      items: items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
    };
  }, [shippingName, shippingPhone, shippingAddress, shippingCity, shippingArea, notes, items]);

  const placeOrder = async () => {
    setError(null);
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity) {
      setError("Please fill in required shipping fields.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/v1/orders", { method: "POST", json: payload });
      clear();
      router.push("/profile/orders");
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
              <CardTitle>Delivery information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Full name *</Label>
                  <Input value={shippingName} onChange={(e) => setShippingName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Phone *</Label>
                  <Input value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Address *</Label>
                <Input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>City *</Label>
                  <Input value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Area</Label>
                  <Input value={shippingArea} onChange={(e) => setShippingArea(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
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
              <Button disabled={loading} className="w-full mt-2" onClick={placeOrder}>
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
