import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthState = {
  user: User | null;
  users: Array<User & { password: string }>;
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const seedUsers: Array<User & { password: string }> = [
  { id: "u1", name: "Admin Atlas", email: "admin@atlas.ma", password: "admin123", role: "admin" },
  { id: "u2", name: "Youssef B.", email: "user@atlas.ma", password: "user1234", role: "user" },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: seedUsers,
      register: (name, email, password) => {
        if (password.length < 6) return { ok: false, error: "Mot de passe trop court (min. 6)" };
        if (get().users.some((u) => u.email === email))
          return { ok: false, error: "Email déjà utilisé" };
        const newUser = { id: `u${Date.now()}`, name, email, password, role: "user" as const };
        set((s) => ({
          users: [...s.users, newUser],
          user: { id: newUser.id, name, email, role: "user" },
        }));
        return { ok: true };
      },
      login: (email, password) => {
        const found = get().users.find((u) => u.email === email && u.password === password);
        if (!found) return { ok: false, error: "Identifiants invalides" };
        set({ user: { id: found.id, name: found.name, email: found.email, role: found.role } });
        return { ok: true };
      },
      logout: () => set({ user: null }),
    }),
    { name: "atlas-auth" },
  ),
);
