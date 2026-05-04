import earbuds from "@/assets/p-earbuds.jpg";
import watch from "@/assets/p-watch.jpg";
import powerbank from "@/assets/p-powerbank.jpg";
import headphones from "@/assets/p-headphones.jpg";
import cable from "@/assets/p-cable.jpg";
import speaker from "@/assets/p-speaker.jpg";
import phoneCase from "@/assets/p-case.jpg";
import mouse from "@/assets/p-mouse.jpg";

export type Category = "Audio" | "Wearables" | "Charge" | "Accessoires" | "Gaming";
export type Brand = "Atlas" | "Sahara" | "MedinaTech" | "Argan" | "Casablanca";

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number; // MAD
  category: Category;
  brand: Brand;
  stock: number;
  image: string;
  rating: number;
  reviewsCount: number;
};

export const seedProducts: Product[] = [
  {
    id: "p1",
    title: "Écouteurs sans fil Atlas Pro",
    description: "Son immersif avec réduction de bruit active. Autonomie 24h avec le boîtier de charge.",
    price: 599,
    category: "Audio",
    brand: "Atlas",
    stock: 42,
    image: earbuds,
    rating: 4.6,
    reviewsCount: 128,
  },
  {
    id: "p2",
    title: "Montre connectée Sahara S2",
    description: "Suivi santé, GPS intégré, écran AMOLED. Compatible iOS et Android.",
    price: 1299,
    category: "Wearables",
    brand: "Sahara",
    stock: 18,
    image: watch,
    rating: 4.4,
    reviewsCount: 86,
  },
  {
    id: "p3",
    title: "Batterie externe MedinaTech 20000mAh",
    description: "Charge rapide 22.5W, 3 ports USB. Idéale pour voyager au Maroc.",
    price: 349,
    category: "Charge",
    brand: "MedinaTech",
    stock: 75,
    image: powerbank,
    rating: 4.7,
    reviewsCount: 211,
  },
  {
    id: "p4",
    title: "Casque Argan Studio One",
    description: "Audio Hi-Res, coussinets en cuir véritable, autonomie 40h.",
    price: 899,
    category: "Audio",
    brand: "Argan",
    stock: 12,
    image: headphones,
    rating: 4.8,
    reviewsCount: 64,
  },
  {
    id: "p5",
    title: "Câble USB-C tressé Casablanca 2m",
    description: "Charge rapide 100W, gaine en nylon tressé ultra-résistante.",
    price: 89,
    category: "Charge",
    brand: "Casablanca",
    stock: 200,
    image: cable,
    rating: 4.3,
    reviewsCount: 340,
  },
  {
    id: "p6",
    title: "Enceinte Bluetooth Atlas Boom",
    description: "Son 360°, étanche IPX7, 16h d'autonomie. Parfaite pour la plage d'Agadir.",
    price: 449,
    category: "Audio",
    brand: "Atlas",
    stock: 28,
    image: speaker,
    rating: 4.5,
    reviewsCount: 97,
  },
  {
    id: "p7",
    title: "Coque cuir Argan iPhone",
    description: "Cuir véritable tanné au Maroc, intérieur microfibre.",
    price: 199,
    category: "Accessoires",
    brand: "Argan",
    stock: 60,
    image: phoneCase,
    rating: 4.2,
    reviewsCount: 52,
  },
  {
    id: "p8",
    title: "Souris gaming Sahara RGB",
    description: "Capteur 16000 DPI, RGB personnalisable, 7 boutons programmables.",
    price: 379,
    category: "Gaming",
    brand: "Sahara",
    stock: 35,
    image: mouse,
    rating: 4.6,
    reviewsCount: 143,
  },
];

export const seedReviews: Review[] = [
  { id: "r1", productId: "p1", author: "Youssef B.", rating: 5, comment: "Excellent son, livraison rapide à Casablanca !", date: "2025-09-12" },
  { id: "r2", productId: "p1", author: "Salma K.", rating: 4, comment: "Très bonne qualité pour le prix.", date: "2025-10-02" },
  { id: "r3", productId: "p2", author: "Omar L.", rating: 5, comment: "La meilleure montre que j'ai eue.", date: "2025-08-21" },
  { id: "r4", productId: "p3", author: "Fatima Z.", rating: 5, comment: "Charge mon téléphone 4 fois, parfait.", date: "2025-10-15" },
  { id: "r5", productId: "p4", author: "Mehdi T.", rating: 5, comment: "Son incroyable, vrai casque studio.", date: "2025-09-30" },
];

export const CATEGORIES: Category[] = ["Audio", "Wearables", "Charge", "Accessoires", "Gaming"];
export const BRANDS: Brand[] = ["Atlas", "Sahara", "MedinaTech", "Argan", "Casablanca"];

export const formatMAD = (n: number) =>
  new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n);
