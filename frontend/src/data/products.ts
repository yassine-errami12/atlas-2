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
    description:
      "Son immersif avec réduction de bruit active. Autonomie 24h avec le boîtier de charge.",
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
  {
    id: "p9",
    title: "Écouteurs intra-auriculaires MedinaTech X",
    description: "Design ergonomique, réduction de bruit, 6h d'autonomie par charge.",
    price: 449,
    category: "Audio",
    brand: "MedinaTech",
    stock: 50,
    image: earbuds,
    rating: 4.5,
    reviewsCount: 95,
  },
  {
    id: "p10",
    title: "Smartband Argan Fit",
    description: "Suivi complet activité, fréquence cardiaque, sommeil.",
    price: 599,
    category: "Wearables",
    brand: "Argan",
    stock: 45,
    image: watch,
    rating: 4.4,
    reviewsCount: 78,
  },
  {
    id: "p11",
    title: "Batterie externe Atlas 10000mAh",
    description: "Compact et léger, affichage LED, 2 ports USB.",
    price: 249,
    category: "Charge",
    brand: "Atlas",
    stock: 100,
    image: powerbank,
    rating: 4.6,
    reviewsCount: 156,
  },
  {
    id: "p12",
    title: "Casque over-ear Casablanca Wave",
    description: "Bluetooth 5.0, batterie 50h, pliable et portable.",
    price: 699,
    category: "Audio",
    brand: "Casablanca",
    stock: 22,
    image: headphones,
    rating: 4.7,
    reviewsCount: 102,
  },
  {
    id: "p13",
    title: "Câble Lightning tressé Atlas 1m",
    description: "Certification Apple MFi, recharge et sync ultra-rapide.",
    price: 79,
    category: "Charge",
    brand: "Atlas",
    stock: 250,
    image: cable,
    rating: 4.4,
    reviewsCount: 289,
  },
  {
    id: "p14",
    title: "Enceinte portable Sahara Mini",
    description: "IPX6 étanche, 12h autonomie, design compact.",
    price: 329,
    category: "Audio",
    brand: "Sahara",
    stock: 55,
    image: speaker,
    rating: 4.5,
    reviewsCount: 118,
  },
  {
    id: "p15",
    title: "Protecteur écran Argan Glass",
    description: "Verre trempé 9H, anti-rayures, pose facile.",
    price: 49,
    category: "Accessoires",
    brand: "Argan",
    stock: 180,
    image: phoneCase,
    rating: 4.3,
    reviewsCount: 201,
  },
  {
    id: "p16",
    title: "Clavier gaming mécanique MedinaTech",
    description: "Switches mécaniques, RGB par touche, 95 touches.",
    price: 599,
    category: "Gaming",
    brand: "MedinaTech",
    stock: 28,
    image: mouse,
    rating: 4.7,
    reviewsCount: 87,
  },
  {
    id: "p17",
    title: "Écouteurs sports Casablanca Run",
    description: "Résistant à la sueur, crochets auriculaires réglables.",
    price: 349,
    category: "Audio",
    brand: "Casablanca",
    stock: 68,
    image: earbuds,
    rating: 4.5,
    reviewsCount: 134,
  },
  {
    id: "p18",
    title: "Montre intelligente Sahara Fit+",
    description: "GPS, natation, + 100 modes sport, 10j autonomie.",
    price: 899,
    category: "Wearables",
    brand: "Sahara",
    stock: 15,
    image: watch,
    rating: 4.8,
    reviewsCount: 145,
  },
  {
    id: "p19",
    title: "Chargeur rapide 65W Atlas",
    description: "GaN Technology, 2 ports USB-C, charge multiple appareils.",
    price: 299,
    category: "Charge",
    brand: "Atlas",
    stock: 85,
    image: powerbank,
    rating: 4.6,
    reviewsCount: 167,
  },
  {
    id: "p20",
    title: "Souris sans fil Argan Pro",
    description: "Précision 2.4GHz, ergonomique, 18 mois batterie.",
    price: 259,
    category: "Accessoires",
    brand: "Argan",
    stock: 72,
    image: mouse,
    rating: 4.5,
    reviewsCount: 109,
  },
];

export const seedReviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Youssef B.",
    rating: 5,
    comment: "Excellent son, livraison rapide à Casablanca !",
    date: "2025-09-12",
  },
  {
    id: "r2",
    productId: "p1",
    author: "Salma K.",
    rating: 4,
    comment: "Très bonne qualité pour le prix.",
    date: "2025-10-02",
  },
  {
    id: "r3",
    productId: "p2",
    author: "Omar L.",
    rating: 5,
    comment: "La meilleure montre que j'ai eue.",
    date: "2025-08-21",
  },
  {
    id: "r4",
    productId: "p3",
    author: "Fatima Z.",
    rating: 5,
    comment: "Charge mon téléphone 4 fois, parfait.",
    date: "2025-10-15",
  },
  {
    id: "r5",
    productId: "p4",
    author: "Mehdi T.",
    rating: 5,
    comment: "Son incroyable, vrai casque studio.",
    date: "2025-09-30",
  },
];

export const CATEGORIES: Category[] = ["Audio", "Wearables", "Charge", "Accessoires", "Gaming"];
export const BRANDS: Brand[] = ["Atlas", "Sahara", "MedinaTech", "Argan", "Casablanca"];

export const formatMAD = (n: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(n);
