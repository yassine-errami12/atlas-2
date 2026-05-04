import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatMAD } from "@/data/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Panier — Atlas.Tech" }] }),
  component: Cart,
});

function Cart() {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const total = items.reduce((a, b) => a + b.price * b.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-6 font-display text-3xl font-bold">Votre panier est vide</h1>
        <p className="mt-2 text-muted-foreground">Découvrez nos produits et trouvez votre prochain coup de cœur.</p>
        <Link to="/shop"><Button size="lg" className="mt-6">Voir la boutique</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Mon panier</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-2xl border bg-card p-4">
              <img src={item.image} alt={item.title} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold">{item.title}</h3>
                  <button onClick={() => remove(item.productId)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-primary font-semibold">{formatMAD(item.price)}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg border">
                    <button onClick={() => setQty(item.productId, item.quantity - 1)} className="px-2 py-1 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => setQty(item.productId, item.quantity + 1)} className="px-2 py-1 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="font-display font-bold">{formatMAD(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 md:sticky md:top-24">
          <h2 className="font-display text-xl font-bold">Récapitulatif</h2>
          <div className="mt-4 space-y-2 border-b pb-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatMAD(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span className="text-secondary">Calculée à la livraison</span></div>
          </div>
          <div className="mt-4 flex items-center justify-between font-display text-xl font-bold">
            <span>Total</span><span className="text-primary">{formatMAD(total)}</span>
          </div>
          <Link to="/checkout"><Button size="lg" className="mt-6 w-full">Passer commande</Button></Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Paiement à la livraison · Sans frais cachés</p>
        </aside>
      </div>
    </div>
  );
}
