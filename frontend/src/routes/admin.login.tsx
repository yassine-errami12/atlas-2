import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Connexion Admin — Atlas.Tech" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate({ to: "/admin/dashboard" });
    }
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!form.email.trim()) {
        toast.error("Veuillez entrer votre email");
        setLoading(false);
        return;
      }

      if (!form.password) {
        toast.error("Veuillez entrer votre mot de passe");
        setLoading(false);
        return;
      }

      // Perform login
      const res = login(form.email.trim(), form.password);
      
      if (!res.ok) {
        toast.error(res.error || "Authentification échouée");
        setLoading(false);
        return;
      }

      // Check if user is admin
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role !== "admin") {
        toast.error("Accès administrateur requis");
        useAuthStore.getState().logout();
        setLoading(false);
        return;
      }

      toast.success("Connecté en tant qu'administrateur");
      navigate({ to: "/admin/dashboard" });
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la connexion");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold">Espace Administrateur</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous pour accéder au tableau de bord d'administration
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-8 shadow-sm">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@atlas.ma"
                className="pl-10"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="pl-10"
                disabled={loading}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-xl border border-dashed bg-muted/30 p-4">
          <p className="text-xs font-semibold text-muted-foreground">Compte de démonstration :</p>
          <div className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">
            <p>Email : <span className="text-foreground">admin@atlas.ma</span></p>
            <p>Mot de passe : <span className="text-foreground">admin123</span></p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
          <p className="font-semibold">🔒 Sécurité</p>
          <p className="mt-1">Cette zone est réservée aux administrateurs. N'utilisez que sur des réseaux sécurisés.</p>
        </div>
      </div>
    </div>
  );
}
