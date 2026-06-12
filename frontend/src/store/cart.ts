import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((x) => x.productId === item.productId);
          if (existing) {
            return {
              items: s.items.map((x) =>
                x.productId === item.productId ? { ...x, quantity: x.quantity + qty } : x
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: qty }] };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((x) => x.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          items: s.items.map((x) =>
            x.productId === productId ? { ...x, quantity: Math.max(1, qty) } : x
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "atlas-cart" }
  )
);
