import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProductsStore } from "@/store/products";
import { CATEGORIES, BRANDS, type Brand, type Category } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type Search = { category?: Category; q?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? (s.category as Category) : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Boutique — Atlas.Tech" },
      {
        name: "description",
        content: "Tous nos accessoires tech : audio, montres, charge, gaming.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const initial = Route.useSearch();
  const products = useProductsStore((s) => s.products);

  const [q, setQ] = useState(initial.q ?? "");
  const [cats, setCats] = useState<Set<Category>>(
    new Set(initial.category ? [initial.category] : []),
  );
  const [brands, setBrands] = useState<Set<Brand>>(new Set());
  const [price, setPrice] = useState<[number, number]>([0, 1500]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (cats.size && !cats.has(p.category)) return false;
      if (brands.size && !brands.has(p.brand)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
  }, [products, q, cats, brands, price]);

  const toggle = <T,>(set: Set<T>, value: T, fn: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    fn(next);
  };

  const Filters = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-display font-semibold">Catégorie</h4>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={cats.has(c)} onCheckedChange={() => toggle(cats, c, setCats)} />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-display font-semibold">Marque</h4>
        <div className="space-y-2">
          {BRANDS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={brands.has(b)}
                onCheckedChange={() => toggle(brands, b, setBrands)}
              />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-display font-semibold">Prix (MAD)</h4>
        <Slider
          value={price}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
          min={0}
          max={1500}
          step={50}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{price[0]} MAD</span>
          <span>{price[1]} MAD</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setCats(new Set());
          setBrands(new Set());
          setPrice([0, 1500]);
          setQ("");
        }}
      >
        Réinitialiser
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Boutique</h1>
          <p className="mt-1 text-muted-foreground">{filtered.length} produits</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-6">{Filters}</div>
        </aside>

        <div className="md:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 w-full gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtres
          </Button>
          {showFilters && <div className="mb-6 rounded-2xl border bg-card p-6">{Filters}</div>}
        </div>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              Aucun produit ne correspond à vos critères.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
