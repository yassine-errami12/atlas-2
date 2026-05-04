import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cart";

export type OrderStatus = "pending" | "shipped" | "delivered";

export type Order = {
  id: string;
  userId: string | null;
  customer: { name: string; phone: string; address: string; city: string };
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: "COD";
  createdAt: string;
};

type OrdersState = {
  orders: Order[];
  create: (o: Omit<Order, "id" | "status" | "createdAt" | "paymentMethod">) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      create: (o) => {
        const order: Order = {
          ...o,
          id: `CMD-${Date.now().toString().slice(-6)}`,
          status: "pending",
          paymentMethod: "COD",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      setStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
    }),
    { name: "atlas-orders" }
  )
);
