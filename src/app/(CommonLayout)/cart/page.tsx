"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/src/providers/cart-provider";
import { RequireAuth } from "@/src/components/shared/require-auth";

export default function CartPage() {
  return (
    <RequireAuth>
      <CartInner />
    </RequireAuth>
  );
}

function CartInner() {
  const { items, subtotal, update, remove } = useCart();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your cart</h1>
            <p className="text-sm text-gray-600 mt-1">Review items before checkout.</p>
          </div>
          <Link href="/shop"><Button variant="outline">Continue shopping</Button></Link>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="font-medium text-gray-900">Cart is empty</p>
              <p className="text-sm text-gray-600 mt-1">Add some medicines to place an order.</p>
              <Link href="/shop"><Button className="mt-4">Browse medicines</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <Card key={it.medicineId} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 bg-white border rounded-lg shrink-0">
                        <Image
                          src={it.imageUrl || "https://placehold.co/400x400?text=MediStore"}
                          alt={it.name}
                          fill
                          className="object-contain p-2"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">{it.name}</p>
                            <p className="text-sm text-gray-600">৳{it.price} / unit</p>
                          </div>
                          <Button variant="ghost" className="text-red-600" onClick={() => remove(it.medicineId)}>
                            Remove
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() => update(it.medicineId, Math.max(1, it.quantity - 1))}
                            >
                              -
                            </Button>
                            <Input
                              value={String(it.quantity)}
                              onChange={(e) => {
                                const v = Number(e.target.value || "1");
                                if (Number.isFinite(v)) update(it.medicineId, Math.max(1, v));
                              }}
                              className="w-16 text-center"
                            />
                            <Button variant="outline" onClick={() => update(it.medicineId, it.quantity + 1)}>
                              +
                            </Button>
                          </div>
                          <p className="font-semibold">৳{it.price * it.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                <Link href="/checkout">
                  <Button className="w-full mt-2">Proceed to checkout</Button>
                </Link>
                <p className="text-xs text-gray-500">Login is required to checkout.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
