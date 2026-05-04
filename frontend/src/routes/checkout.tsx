import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";
import { useAuthStore } from "@/store/auth";
import { formatMAD } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Commande — Atlas.Tech" }] }),
  component: Checkout,
});

function Checkout() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const create = useOrdersStore((s) => s.create);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name ?? "", phone: "", address: "", city: "" });
  const [done, setDone] = useState<{ id: string } | null>(null);

  const total = items.reduce((a, b) => a + b.price * b.quantity, 0);

  if (items.length === 0 && !done) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Votre panier est vide.</p>
        <Link to="/shop"><Button className="mt-4">Voir la boutique</Button></Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-secondary" />
        <h1 className="mt-6 font-display text-4xl font-bold">Merci pour votre commande !</h1>
        <p className="mt-2 text-muted-foreground">Numéro de commande : <span className="font-mono font-semibold text-foreground">{done.id}</span></p>
        <p className="mt-4 text-sm text-muted-foreground">Vous serez contacté pour confirmer la livraison. Paiement en cash à la réception.</p>
        <Button className="mt-8" onClick={() => navigate({ to: "/" })}>Retour à l'accueil</Button>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      return toast.error("Tous les champs sont requis");
    }
    if (!/^[0-9+\s]{8,}$/.test(form.phone)) return toast.error("Numéro de téléphone invalide");
    const order = create({
      userId: user?.id ?? null,
      customer: form,
      items,
      total,
    });
    clear();
    setDone({ id: order.id });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Finaliser la commande</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-6 rounded-2xl border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Informations de livraison</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06 00 00 00 00" required maxLength={20} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required maxLength={300} rows={2} />
            </div>
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Casablanca, Rabat..." required maxLength={80} />
            </div>
          </div>

          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <Banknote className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">Paiement à la livraison (Cash)</div>
                <div className="text-sm text-muted-foreground">Payez en espèces en recevant votre colis</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 md:sticky md:top-24">
          <h2 className="font-display text-xl font-bold">Récapitulatif</h2>
          <div className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between">
                <span className="line-clamp-1 text-muted-foreground">{i.quantity}× {i.title}</span>
                <span>{formatMAD(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4 font-display text-xl font-bold">
            <span>Total</span><span className="text-primary">{formatMAD(total)}</span>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full">Confirmer la commande</Button>
        </aside>
      </form>
    </div>
  );
}
