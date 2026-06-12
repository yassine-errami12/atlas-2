import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useOrdersStore, type PaymentMethod } from "@/store/orders";
import { formatMAD } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Commande - Atlas.Tech" }] }),
  component: Checkout,
});

function Checkout() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const create = useOrdersStore((s) => s.create);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name ?? "", phone: "", address: "", city: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [done, setDone] = useState<{ id: string; paymentMethod: PaymentMethod } | null>(null);

  const total = items.reduce((a, b) => a + b.price * b.quantity, 0);

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const validateCard = () => {
    const digits = card.number.replace(/\D/g, "");
    const expiry = card.expiry.trim();
    const cvc = card.cvc.trim();

    if (!card.name.trim()) return "Le nom sur la carte est requis";
    if (digits.length !== 16) return "Le numero de carte doit contenir 16 chiffres";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return "La date d'expiration doit etre au format MM/AA";
    if (!/^\d{3,4}$/.test(cvc)) return "Le code CVC doit contenir 3 ou 4 chiffres";

    const [month, year] = expiry.split("/").map(Number);
    const expiryDate = new Date(2000 + year, month);
    if (expiryDate <= new Date()) return "La carte est expiree";

    return null;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      return toast.error("Tous les champs sont requis");
    }
    if (!/^[0-9+\s]{8,}$/.test(form.phone)) {
      return toast.error("Numero de telephone invalide");
    }
    if (paymentMethod === "CARD") {
      const cardError = validateCard();
      if (cardError) return toast.error(cardError);
    }

    const order = create({
      userId: user?.id ?? null,
      customer: form,
      items,
      total,
      paymentMethod,
    });

    clear();
    toast.success(paymentMethod === "CARD" ? "Paiement en ligne accepte" : "Commande confirmee");
    setDone({ id: order.id, paymentMethod });
  };

  if (items.length === 0 && !done) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Votre panier est vide.</p>
        <Link to="/shop">
          <Button className="mt-4">Voir la boutique</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-secondary" />
        <h1 className="mt-6 font-display text-4xl font-bold">Merci pour votre commande !</h1>
        <p className="mt-2 text-muted-foreground">
          Numero de commande : <span className="font-mono font-semibold text-foreground">{done.id}</span>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          {done.paymentMethod === "CARD"
            ? "Votre paiement en ligne a ete valide. Vous serez contacte pour confirmer la livraison."
            : "Vous serez contacte pour confirmer la livraison. Paiement en cash a la reception."}
        </p>
        <Button className="mt-8" onClick={() => navigate({ to: "/" })}>
          Retour a l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Finaliser la commande</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-6 rounded-2xl border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Informations de livraison</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telephone *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="06 00 00 00 00"
                required
                maxLength={20}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                maxLength={300}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Casablanca, Rabat..."
                required
                maxLength={80}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold">Mode de paiement</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                  paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-semibold">Paiement a la livraison</div>
                    <div className="text-sm text-muted-foreground">Payez en especes a la reception</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                  paymentMethod === "CARD" ? "border-secondary bg-secondary/5" : "border-border bg-background hover:border-secondary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-secondary" />
                  <div>
                    <div className="font-semibold">Paiement en ligne</div>
                    <div className="text-sm text-muted-foreground">Carte bancaire securisee</div>
                  </div>
                </div>
              </button>
            </div>

            {paymentMethod === "CARD" && (
              <div className="rounded-xl border bg-background p-4">
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                  Les informations de carte sont validees pour cette demo et ne sont pas stockees.
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="cardName">Nom sur la carte *</Label>
                    <Input
                      id="cardName"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      placeholder="Youssef Atlas"
                      autoComplete="cc-name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="cardNumber">Numero de carte *</Label>
                    <Input
                      id="cardNumber"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardExpiry">Expiration *</Label>
                    <Input
                      id="cardExpiry"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/AA"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC *</Label>
                    <Input
                      id="cardCvc"
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 md:sticky md:top-24">
          <h2 className="font-display text-xl font-bold">Recapitulatif</h2>
          <div className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between">
                <span className="line-clamp-1 text-muted-foreground">
                  {i.quantity}x {i.title}
                </span>
                <span>{formatMAD(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4 font-display text-xl font-bold">
            <span>Total</span>
            <span className="text-primary">{formatMAD(total)}</span>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full">
            {paymentMethod === "CARD" ? `Payer ${formatMAD(total)}` : "Confirmer la commande"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
