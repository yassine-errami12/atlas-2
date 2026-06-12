import { FormEvent, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, MessageCircle, Minus, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { useProductsStore } from "@/store/products";
import { formatMAD, type Product } from "@/data/products";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
  products?: Product[];
};

const quickPrompts = [
  "Meilleurs produits",
  "Livraison",
  "Paiement",
  "Aide panier",
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getBotReply(message: string, products: Product[], cartCount: number): Omit<ChatMessage, "id" | "role"> {
  const text = normalize(message);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const lowPrice = [...products].sort((a, b) => a.price - b.price).slice(0, 3);

  if (text.includes("livraison") || text.includes("delivery")) {
    return {
      content:
        "La livraison est disponible au Maroc. Pour finaliser, ajoutez vos articles au panier puis passez au checkout avec vos coordonnees.",
    };
  }

  if (text.includes("paiement") || text.includes("cash") || text.includes("cod")) {
    return {
      content:
        "Atlas.Tech met en avant le paiement a la livraison. Vous pouvez commander maintenant et payer quand votre commande arrive.",
    };
  }

  if (text.includes("panier") || text.includes("cart") || text.includes("commande")) {
    return {
      content:
        cartCount > 0
          ? `Vous avez ${cartCount} article(s) dans le panier. Vous pouvez verifier les quantites ou passer au checkout.`
          : "Votre panier est vide pour le moment. Je peux vous aider a choisir un produit populaire.",
      products: cartCount > 0 ? undefined : topRated,
    };
  }

  if (text.includes("prix") || text.includes("budget") || text.includes("moins cher") || text.includes("cheap")) {
    return {
      content: "Voici les options les plus accessibles du catalogue.",
      products: lowPrice,
    };
  }

  const categoryMatch = products.find((product) => text.includes(normalize(product.category)));
  if (categoryMatch) {
    const matches = products
      .filter((product) => product.category === categoryMatch.category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return {
      content: `Bonne idee. En ${categoryMatch.category}, je regarderais d'abord ces produits.`,
      products: matches,
    };
  }

  return {
    content:
      "Je peux vous aider a trouver un accessoire, comparer les meilleurs avis, expliquer la livraison, ou vous guider vers le checkout.",
    products: topRated,
  };
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const products = useProductsStore((state) => state.products);
  const cartItems = useCartStore((state) => state.items);
  const messageId = useRef(2);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const bestProducts = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 3),
    [products],
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content: "Bonjour, je suis l'assistant Atlas.Tech. Je peux recommander des produits ou aider avec votre commande.",
      products: bestProducts,
    },
  ]);

  const sendMessage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: messageId.current++,
      role: "user",
      content: trimmed,
    };
    const botMessage: ChatMessage = {
      id: messageId.current++,
      role: "assistant",
      ...getBotReply(trimmed, products, cartCount),
    };

    setMessages((current) => [...current, userMessage, botMessage]);
    setInput("");
    setOpen(true);
    setMinimized(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  if (!open) {
    return (
      <Button
        type="button"
        size="lg"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        className="fixed bottom-5 right-5 z-50 h-14 rounded-full px-5 shadow-warm"
        aria-label="Ouvrir le chatbot"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Besoin d'aide ?</span>
      </Button>
    );
  }

  return (
    <section className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-lg border bg-card text-card-foreground shadow-warm">
      <div className="flex items-center justify-between border-b bg-secondary px-4 py-3 text-secondary-foreground">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary-foreground/15">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold leading-none">Assistant Atlas.Tech</h2>
            <p className="mt-1 text-xs text-secondary-foreground/80">Reponses instantanees</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-secondary-foreground hover:bg-secondary-foreground/15 hover:text-secondary-foreground"
            onClick={() => setMinimized((value) => !value)}
            aria-label={minimized ? "Agrandir le chatbot" : "Reduire le chatbot"}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-secondary-foreground hover:bg-secondary-foreground/15 hover:text-secondary-foreground"
            onClick={() => setOpen(false)}
            aria-label="Fermer le chatbot"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="max-h-[24rem] space-y-4 overflow-y-auto bg-background/70 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "ml-8 flex justify-end" : "mr-4"}
              >
                <div
                  className={
                    message.role === "user"
                      ? "rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "rounded-lg border bg-card px-3 py-2 text-sm shadow-sm"
                  }
                >
                  <p>{message.content}</p>
                  {message.products && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <Link
                          key={product.id}
                          to="/product/$id"
                          params={{ id: product.id }}
                          className="flex items-center gap-2 rounded-md border bg-background p-2 text-foreground transition-colors hover:border-primary"
                        >
                          <img
                            src={product.image}
                            alt=""
                            className="h-11 w-11 rounded-md object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold">{product.title}</span>
                            <span className="block text-xs text-muted-foreground">
                              {formatMAD(product.price)} · {product.rating}/5
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t bg-card p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => sendMessage(prompt)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {prompt}
                </Button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Posez votre question..."
                aria-label="Message chatbot"
              />
              <Button type="submit" size="icon" aria-label="Envoyer">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <Link
              to="/cart"
              className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {cartCount > 0 ? `${cartCount} article(s) dans le panier` : "Voir le panier"}
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
