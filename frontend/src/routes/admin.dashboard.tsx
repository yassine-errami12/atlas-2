import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ShoppingCart, Users, TrendingUp, Package } from "lucide-react";
import { useProductsStore } from "@/store/products";
import { useAuthStore } from "@/store/auth";
import { formatMAD } from "@/data/products";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const products = useProductsStore((s) => s.products);
  const user = useAuthStore((s) => s.user);
  const reviews = useProductsStore((s) => s.reviews);

  // Calculate statistics
  const totalProducts = products.length;
  const totalReviews = reviews.length;
  const averageRating =
    products.length > 0
      ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
      : "0";
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  // Calculate total inventory value
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Get top products by rating
  const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);

  // Get most reviewed products
  const topReviewed = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold">Bienvenue, {user?.name}!</h2>
        <p className="text-muted-foreground">Voici un aperçu de votre boutique Atlas.Tech</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Produits"
          value={totalProducts}
          icon={Package}
          color="bg-blue-500/10 text-blue-600"
        />
        <MetricCard
          title="Stock Total"
          value={totalStock}
          icon={ShoppingCart}
          color="bg-green-500/10 text-green-600"
        />
        <MetricCard
          title="Valeur Inventaire"
          value={formatMAD(inventoryValue)}
          icon={TrendingUp}
          color="bg-purple-500/10 text-purple-600"
        />
        <MetricCard
          title="Évaluations"
          value={totalReviews}
          icon={BarChart3}
          color="bg-amber-500/10 text-amber-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Average Rating */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold">Note Moyenne des Produits</h3>
          <div className="mt-4 flex items-end gap-4">
            <div className="text-5xl font-bold text-primary">{averageRating}</div>
            <div className="mb-2 text-lg text-muted-foreground">/ 5.0 ⭐</div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Basé sur {totalReviews} évaluations clients
          </p>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold">Statistiques Rapides</h3>
          <div className="mt-4 space-y-3">
            <StatRow
              label="Produits en stock"
              value={products.filter((p) => p.stock > 0).length}
              total={totalProducts}
            />
            <StatRow
              label="Produits faibles"
              value={products.filter((p) => p.stock <= 10).length}
              total={totalProducts}
              warning={true}
            />
            <StatRow
              label="Produits en rupture"
              value={products.filter((p) => p.stock === 0).length}
              total={totalProducts}
              danger={true}
            />
          </div>
        </div>
      </div>

      {/* Top Products Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Rated Products */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="border-b bg-muted/50 px-6 py-4">
            <h3 className="font-semibold">Top Produits (Note)</h3>
          </div>
          <div className="divide-y">
            {topProducts.length > 0 ? (
              topProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold">{p.rating.toFixed(1)} ⭐</p>
                    <p className="text-xs text-muted-foreground">{p.reviewsCount} avis</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                Aucun produit disponible
              </div>
            )}
          </div>
        </div>

        {/* Most Reviewed Products */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="border-b bg-muted/50 px-6 py-4">
            <h3 className="font-semibold">Produits les Plus Évalués</h3>
          </div>
          <div className="divide-y">
            {topReviewed.length > 0 ? (
              topReviewed.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{formatMAD(p.price)}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold">{p.reviewsCount}</p>
                    <p className="text-xs text-muted-foreground">évaluations</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                Aucun produit disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  total,
  warning = false,
  danger = false,
}: {
  label: string;
  value: number;
  total: number;
  warning?: boolean;
  danger?: boolean;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  let barColor = "bg-green-500";
  if (danger) barColor = "bg-red-500";
  else if (warning) barColor = "bg-amber-500";

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium">{label}</p>
        <p
          className={`text-sm font-semibold ${danger ? "text-red-600" : warning ? "text-amber-600" : "text-green-600"}`}
        >
          {value} / {total}
        </p>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
