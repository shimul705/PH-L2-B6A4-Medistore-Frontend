"use client";

import Link from "next/link";
import Image from "next/image";
import { RequireAuth } from "@/src/components/shared/require-auth";
import { useWishlist } from "@/src/providers/wishlist-provider";
import { useCart } from "@/src/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WishlistPage() {
  return (
    <RequireAuth>
      <WishlistInner />
    </RequireAuth>
  );
}

function WishlistInner() {
  const { items, remove, clear } = useWishlist();
  const { add } = useCart();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Wishlist</h1>
            <p className="text-sm text-gray-600 mt-1">Items you saved for later.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/shop"><Button variant="outline">Browse medicines</Button></Link>
            {items.length > 0 && (
              <Button variant="outline" className="text-red-600" onClick={() => clear()}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="font-medium text-gray-900">Wishlist is empty</p>
              <p className="text-sm text-gray-600 mt-1">Save medicines to buy later.</p>
              <Link href="/shop"><Button className="mt-4">Browse medicines</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => (
              <Card key={it.medicineId} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-white">
                  <Image
                    src={it.imageUrl || "https://placehold.co/600x400?text=MediStore"}
                    alt={it.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{it.name}</CardTitle>
                  <p className="text-sm text-gray-700 font-semibold">৳{it.price}</p>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      add({ medicineId: it.medicineId, name: it.name, price: it.price, imageUrl: it.imageUrl ?? null });
                    }}
                  >
                    Add to cart
                  </Button>
                  <Button variant="outline" className="text-red-600" onClick={() => remove(it.medicineId)}>
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
