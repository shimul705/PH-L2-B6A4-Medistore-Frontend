"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/providers/auth-provider";

export type WishlistItem = {
  medicineId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  has: (medicineId: string) => boolean;
  add: (item: WishlistItem) => void;
  remove: (medicineId: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY_PREFIX = "medistore.wishlist.v1";
const keyForUser = (userId: string) => `${STORAGE_KEY_PREFIX}:${userId}`;

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user?.id) {
      setItems([]);
      return;
    }

    try {
      const raw = localStorage.getItem(keyForUser(user.id));
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, [user?.id, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!user?.id) return;
    try {
      localStorage.setItem(keyForUser(user.id), JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, user?.id, isLoading]);

  const value = useMemo<WishlistContextValue>(() => {
    const count = items.length;
    const has = (medicineId: string) => items.some((i) => i.medicineId === medicineId);
    const add = (item: WishlistItem) =>
      setItems((prev) => (prev.some((p) => p.medicineId === item.medicineId) ? prev : [item, ...prev]));
    const remove = (medicineId: string) => setItems((prev) => prev.filter((p) => p.medicineId !== medicineId));
    const clear = () => setItems([]);
    return { items, count, has, add, remove, clear };
  }, [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
