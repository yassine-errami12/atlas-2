import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Atlas.Tech" }] }),
  component: Login,
});

function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(form.email.trim(), form.password);
    if (!res.ok) return toast.error(res.error);
    toast.success("Connecté !");
    navigate({ to: "/" });
  };

  return (
    <div className="container mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-4xl font-bold">Connexion</h1>
      <p className="mt-1 text-muted-foreground">Heureux de vous revoir.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border bg-card p-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <Button type="submit" className="w-full" size="lg">Se connecter</Button>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ? <Link to="/register" className="text-primary hover:underline">Inscription</Link>
        </p>
      </form>
      <div className="mt-4 rounded-xl border border-dashed bg-muted/30 p-4 text-xs text-muted-foreground">
        <p className="font-semibold">Comptes de démo :</p>
        <p>Admin · admin@atlas.ma / admin123</p>
        <p>Client · user@atlas.ma / user1234</p>
      </div>
    </div>
  );
}
