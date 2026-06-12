import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useProductsStore } from "@/store/products";
import { CATEGORIES } from "@/data/products";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const products = useProductsStore((s) => s.products);
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden zellige-pattern">
        <div className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-2 md:py-24 md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
              ✨ Made in Morocco
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl">
              La tech qui suit
              <span className="block text-primary italic">votre rythme.</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Écouteurs, montres connectées, charge et gaming — sélectionnés pour vous, livrés partout au Maroc avec paiement à la livraison.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg" className="gap-2 text-base">
                  Découvrir la boutique <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-base">Notre histoire</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
            <img
              src={hero}
              alt="Tech accessoires"
              width={1600}
              height={1024}
              className="relative rounded-3xl shadow-[var(--shadow-warm)]"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y bg-card">
        <div className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-3">
          {[
            { icon: Truck, t: "Livraison Maroc", d: "Partout en 2-4 jours ouvrés" },
            { icon: ShieldCheck, t: "Paiement à la livraison", d: "Payez en cash en recevant" },
            { icon: Headphones, t: "Service client", d: "Une équipe basée à Casablanca" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display font-semibold">{t}</div>
                <div className="text-sm text-muted-foreground">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Catégories</h2>
            <p className="mt-2 text-muted-foreground">Trouvez ce qu'il vous faut</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
            >
              <div
                className="absolute right-0 top-0 h-20 w-20 rounded-full opacity-10 transition-transform group-hover:scale-150"
                style={{ background: i % 2 ? "var(--terracotta)" : "var(--teal)" }}
              />
              <div className="font-display text-lg font-semibold">{c}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container mx-auto px-4 py-8 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Best-sellers</h2>
            <p className="mt-2 text-muted-foreground">Les coups de cœur du moment</p>
          </div>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
            Tout voir →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
