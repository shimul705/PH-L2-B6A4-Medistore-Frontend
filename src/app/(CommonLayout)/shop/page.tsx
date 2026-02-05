"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/src/providers/cart-provider";
import { useAuth } from "@/src/providers/auth-provider";
import { useWishlist } from "@/src/providers/wishlist-provider";
import Image from "next/image";
import { Heart } from "lucide-react";

type Category = { id: string; name: string };
type Medicine = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  manufacturer?: string | null;
  imageUrl?: string | null;
  category?: Category;
};

export default function ShopPage() {
  const params = useSearchParams();
  const initialSearch = params.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const { add } = useCart();
  const { user } = useAuth();
  const wishlist = useWishlist();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiFetch<{ success: boolean; data: Medicine[] }>(
      `/api/v1/medicines${initialSearch ? `?search=${encodeURIComponent(initialSearch)}` : ""}`
    )
      .then((res) => {
        if (mounted) setMedicines(res.data || []);
      })
      .catch(() => {
        if (mounted) setMedicines([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [initialSearch]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return medicines;
    return medicines.filter((m) =>
      [m.name, m.description, m.manufacturer, m.category?.name].some((v) =>
        (v || "").toLowerCase().includes(s)
      )
    );
  }, [medicines, search]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Medicines</h1>
            <p className="text-sm text-gray-600 mt-1">Authentic medicines from licensed sellers.</p>
          </div>
          <div className="w-full md:w-96">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, manufacturer..."
              className="bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-44 w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <p className="text-gray-700 font-medium">No medicines found.</p>
            <p className="text-gray-500 text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((m) => (
              <Card key={m.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-white">
                  <Image
                    src={m.imageUrl || "https://placehold.co/600x400?text=MediStore"}
                    alt={m.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{m.name}</CardTitle>
                  <p className="text-xs text-gray-500">{m.category?.name || "Uncategorized"}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{m.description || "—"}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">৳{m.price}</p>
                    <p className={`text-xs ${m.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {m.stock > 0 ? `${m.stock} in stock` : "Out of stock"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/shop/${m.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Details</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!user) {
                        window.location.href = `/login?next=${encodeURIComponent("/shop")}`;
                        return;
                      }
                      if (wishlist.has(m.id)) wishlist.remove(m.id);
                      else wishlist.add({ medicineId: m.id, name: m.name, price: m.price, imageUrl: m.imageUrl ?? null });
                    }}
                    className="shrink-0"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.has(m.id) ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={m.stock <= 0}
                    onClick={() => {
                      // Require login for add-to-cart (as requested)
                      if (!user) {
                        window.location.href = `/login?next=${encodeURIComponent("/shop")}`;
                        return;
                      }
                      add({ medicineId: m.id, name: m.name, price: m.price, imageUrl: m.imageUrl ?? null });
                    }}
                  >
                    Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
