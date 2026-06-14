import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { formatMAD, type Product } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-secondary">
            {product.brand}
          </span>
          {product.stock < 20 && (
            <span className="text-xs font-medium text-primary">Stock limité</span>
          )}
        </div>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 font-display text-lg font-semibold leading-tight hover:text-primary"
        >
          {product.title}
        </Link>
        <div className="flex items-center gap-2">
          <StarRating value={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviewsCount})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-xl font-bold text-primary">
            {formatMAD(product.price)}
          </span>
          <Button
            size="sm"
            onClick={() => {
              add({
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
              });
              toast.success("Ajouté au panier");
            }}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
