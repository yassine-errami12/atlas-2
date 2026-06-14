import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Truck, ShieldCheck, ChevronLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { ProductCard } from "@/components/ProductCard";
import { useProductsStore } from "@/store/products";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatMAD } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Produit introuvable</h1>
      <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
        ← Retour à la boutique
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const products = useProductsStore((s) => s.products);
  const reviews = useProductsStore((s) => s.reviews);
  const addReview = useProductsStore((s) => s.addReview);
  const add = useCartStore((s) => s.add);
  const user = useAuthStore((s) => s.user);

  const product = products.find((p) => p.id === id);
  if (!product) throw notFound();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const productReviews = reviews.filter((r) => r.productId === id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate({ to: "/shop" })}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> Retour
      </button>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border bg-card">
          <img
            src={product.image}
            alt={product.title}
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium uppercase tracking-wider text-secondary">
            {product.brand} · {product.category}
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            {product.title}
          </h1>
          <div className="flex items-center gap-3">
            <StarRating value={product.rating} size={18} />
            <span className="text-sm text-muted-foreground">
              {product.rating} · {product.reviewsCount} avis
            </span>
          </div>
          <div className="font-display text-4xl font-bold text-primary">
            {formatMAD(product.price)}
          </div>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="my-2 flex items-center gap-3">
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-muted">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={() => {
                add(
                  {
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                  },
                  qty,
                );
                toast.success(`${qty} × ${product.title} ajouté au panier`);
              }}
            >
              <ShoppingBag className="h-4 w-4" /> Ajouter au panier
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3 rounded-2xl bg-muted p-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" /> Livraison Maroc
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Garantie 1 an
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold">Avis clients ({productReviews.length})</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            {productReviews.length === 0 && (
              <p className="text-muted-foreground">Aucun avis pour le moment. Soyez le premier !</p>
            )}
            {productReviews.map((r) => (
              <div key={r.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.author}</div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <StarRating value={r.rating} className="my-2" />
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Laisser un avis</h3>
            {user ? (
              <div className="mt-4 space-y-3">
                <div>
                  <Label>Note</Label>
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        type="button"
                        className="text-2xl"
                      >
                        <span className={n <= rating ? "text-accent" : "text-muted-foreground/40"}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Commentaire</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Votre avis..."
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!comment.trim()) return toast.error("Écrivez un commentaire");
                    addReview({
                      productId: id,
                      author: user.name,
                      rating,
                      comment: comment.trim(),
                    });
                    setComment("");
                    toast.success("Merci pour votre avis !");
                  }}
                >
                  Publier
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Connectez-vous
                </Link>{" "}
                pour laisser un avis.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold">Vous aimerez aussi</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
