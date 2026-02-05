"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/providers/auth-provider";

export type CartItem = {
  medicineId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (medicineId: string) => void;
  update: (medicineId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY_PREFIX = "medistore.cart.v1";

const keyForUser = (userId: string) => `${STORAGE_KEY_PREFIX}:${userId}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, isLoading } = useAuth();

  // Load cart for the currently logged-in user.
  useEffect(() => {
    // While auth is loading, keep current state.
    if (isLoading) return;

    // No user -> cart should be empty (private cart)
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

  // Persist cart per-user
  useEffect(() => {
    if (isLoading) return;
    if (!user?.id) return;
    try {
      localStorage.setItem(keyForUser(user.id), JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, user?.id, isLoading]);

  const add: CartContextValue["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.medicineId === item.medicineId);
      if (existing) {
        return prev.map((p) =>
          p.medicineId === item.medicineId ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const remove: CartContextValue["remove"] = (medicineId) => {
    setItems((prev) => prev.filter((p) => p.medicineId !== medicineId));
  };

  const update: CartContextValue["update"] = (medicineId, qty) => {
    setItems((prev) =>
      prev
        .map((p) => (p.medicineId === medicineId ? { ...p, quantity: qty } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const clear = () => setItems([]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
    return { items, count, subtotal, add, remove, update, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
