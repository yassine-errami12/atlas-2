import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { useProductsStore } from "@/store/products";
import { useOrdersStore } from "@/store/orders";
import { useAuthStore } from "@/store/auth";
import { formatMAD } from "@/data/products";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const products = useProductsStore((s) => s.products);
  const orders = useOrdersStore((s) => s.orders);
  const users = useAuthStore((s) => s.users);
  const revenue = orders.filter((o) => o.status === "delivered").reduce((a, b) => a + b.total, 0);

  const stats = [
    { label: "Produits", value: products.length, icon: Package, color: "var(--terracotta)" },
    { label: "Commandes", value: orders.length, icon: ShoppingCart, color: "var(--teal)" },
    { label: "Utilisateurs", value: users.length, icon: Users, color: "var(--gold)" },
    { label: "CA livré", value: formatMAD(revenue), icon: TrendingUp, color: "var(--terracotta)" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in oklab, ${s.color} 15%, transparent)`,
                color: s.color,
              }}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Dernières commandes</h2>
        <div className="mt-4 space-y-2">
          {orders.slice(0, 5).map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <span className="font-mono">{o.id}</span>
              <span>{o.customer.name}</span>
              <span className="font-semibold">{formatMAD(o.total)}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{o.status}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune commande encore.</p>
          )}
        </div>
      </div>
    </div>
  );
}
