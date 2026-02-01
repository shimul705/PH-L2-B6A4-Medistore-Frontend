"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/src/providers/cart-provider";
import { useAuth } from "@/src/providers/auth-provider";

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

export default function MedicineDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const { add } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiFetch<{ success: boolean; data: Medicine }>(`/api/v1/medicines/${id}`)
      .then((res) => mounted && setMedicine(res.data))
      .catch(() => mounted && setMedicine(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-700">Medicine not found.</p>
          <Button variant="outline" className="mt-3" onClick={() => router.push("/shop")}>
            Back to shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <div className="relative h-80 bg-white">
              <Image
                src={medicine.imageUrl || "https://placehold.co/900x600?text=MediStore"}
                alt={medicine.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{medicine.name}</CardTitle>
              <p className="text-sm text-gray-600">{medicine.category?.name || "Uncategorized"}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{medicine.description || "—"}</p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-white border rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-lg font-semibold">৳{medicine.price}</p>
                </div>
                <div className="bg-white border rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className={`text-lg font-semibold ${medicine.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {medicine.stock > 0 ? medicine.stock : "Out"}
                  </p>
                </div>
                {medicine.manufacturer && (
                  <div className="bg-white border rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500">Manufacturer</p>
                    <p className="text-lg font-semibold">{medicine.manufacturer}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push("/shop")}>Back</Button>
                <Button
                  className="flex-1"
                  disabled={medicine.stock <= 0}
                  onClick={() => {
                    if (!user) {
                      router.push(`/login?next=${encodeURIComponent(`/shop/${medicine.id}`)}`);
                      return;
                    }
                    add({ medicineId: medicine.id, name: medicine.name, price: medicine.price, imageUrl: medicine.imageUrl ?? null });
                    router.push("/cart");
                  }}
                >
                  Add to cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
