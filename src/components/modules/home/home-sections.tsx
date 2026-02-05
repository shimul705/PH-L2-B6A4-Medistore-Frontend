"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Category = { id: string; name: string };
type Medicine = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category?: Category;
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex items-end justify-between gap-4 mb-5">
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export function HomeSections() {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      apiFetch<{ success: boolean; data: Medicine[] }>("/api/v1/medicines"),
      apiFetch<{ success: boolean; data: Category[] }>("/api/v1/categories"),
    ])
      .then(([m, c]) => {
        if (!mounted) return;
        setMedicines(m?.data || []);
        setCategories(c?.data || []);
      })
      .catch(() => {
        if (!mounted) return;
        setMedicines([]);
        setCategories([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const lowStock = useMemo(() => {
    // last 5 low stock medicines (in stock, sorted by smallest stock)
    return [...medicines]
      .filter((m) => typeof m.stock === "number" && m.stock > 0)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  }, [medicines]);

  const newArrivals = useMemo(() => {
    // "new" is not available directly; show a small featured set (highest stock)
    return [...medicines]
      .filter((m) => typeof m.stock === "number" && m.stock > 0)
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 6);
  }, [medicines]);

  return (
    <div className="bg-zinc-50">
      <div className="container mx-auto px-4 pb-12">
        {/* 1) Limited stock */}
        <section className="mt-10">
          <SectionTitle
            title="Limited stock"
            subtitle="Grab these soon — only a few units left."
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-28 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-gray-600">
                No low stock medicines found.
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {lowStock.map((m) => (
                <Link key={m.id} href={`/shop/${m.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-28 bg-white">
                      <Image
                        src={m.imageUrl || "https://placehold.co/600x400?text=MediStore"}
                        alt={m.name}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 20vw"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm line-clamp-1">{m.name}</CardTitle>
                      <p className="text-xs text-gray-600">Stock: <span className="font-semibold text-red-600">{m.stock}</span></p>
                      <p className="text-xs font-semibold">৳{m.price}</p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 2) Categories */}
        <section className="mt-12">
          <SectionTitle title="Browse by category" subtitle="Find medicines faster by exploring categories." />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-gray-600">No categories found.</CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((c) => (
                <Link key={c.id} href={`/shop?search=${encodeURIComponent(c.name)}`}>
                  <div className="bg-white border rounded-xl px-4 py-4 hover:shadow-sm transition flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{c.name}</span>
                    <span className="text-sm text-gray-500">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 3) Featured / New arrivals */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular medicines</h2>
              <p className="text-sm text-gray-600 mt-1">A quick selection you can order today.</p>
            </div>
            <Link href="/shop"><Button variant="outline">View all</Button></Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {newArrivals.map((m) => (
                <Link key={m.id} href={`/shop/${m.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-white">
                      <Image
                        src={m.imageUrl || "https://placehold.co/600x400?text=MediStore"}
                        alt={m.name}
                        fill
                        className="object-contain p-5"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base line-clamp-1">{m.name}</CardTitle>
                      <p className="text-sm text-gray-600">{m.category?.name || "Uncategorized"}</p>
                      <p className="text-sm font-semibold">৳{m.price}</p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 4) Reviews */}
        <section className="mt-12">
          <SectionTitle title="Customer reviews" subtitle="What people say about MediStore." />

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Ayesha Rahman",
                quote: "Delivery was fast and the medicines were well packaged. Highly recommended!",
                stars: 5,
              },
              {
                name: "Mizanur Hasan",
                quote: "Easy ordering experience and good prices compared to local shops.",
                stars: 5,
              },
              {
                name: "Nusrat Jahan",
                quote: "Great customer support and authentic products. Will order again.",
                stars: 4,
              },
            ].map((r) => (
              <Card key={r.name} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < r.stars ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mt-3">“{r.quote}”</p>
                  <p className="text-sm text-gray-600 mt-4 font-semibold">— {r.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
