import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedProducts, seedReviews, type Product, type Review } from "@/data/products";

type ProductsState = {
  products: Product[];
  reviews: Review[];
  addProduct: (p: Omit<Product, "id" | "rating" | "reviewsCount">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReview: (r: Omit<Review, "id" | "date">) => void;
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      products: seedProducts,
      reviews: seedReviews,
      addProduct: (p) =>
        set((s) => ({
          products: [
            ...s.products,
            { ...p, id: `p${Date.now()}`, rating: 0, reviewsCount: 0 },
          ],
        })),
      updateProduct: (id, p) =>
        set((s) => ({
          products: s.products.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
      addReview: (r) =>
        set((s) => {
          const review: Review = {
            ...r,
            id: `r${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
          };
          const newReviews = [...s.reviews, review];
          const productReviews = newReviews.filter((x) => x.productId === r.productId);
          const avg = productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length;
          return {
            reviews: newReviews,
            products: s.products.map((p) =>
              p.id === r.productId
                ? { ...p, rating: Math.round(avg * 10) / 10, reviewsCount: productReviews.length }
                : p
            ),
          };
        }),
    }),
    { name: "atlas-products" }
  )
);
