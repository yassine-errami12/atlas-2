import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Inscription — Atlas.Tech" }] }),
  component: Register,
});

function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Nom trop court");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error("Email invalide");
    const res = register(form.name.trim(), form.email.trim(), form.password);
    if (!res.ok) return toast.error(res.error);
    toast.success("Compte créé !");
    navigate({ to: "/" });
  };

  return (
    <div className="container mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-4xl font-bold">Inscription</h1>
      <p className="mt-1 text-muted-foreground">Rejoignez la communauté Atlas.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border bg-card p-6">
        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={100}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe (min. 6)</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Créer un compte
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Connexion
          </Link>
        </p>
      </form>
    </div>
  );
}
