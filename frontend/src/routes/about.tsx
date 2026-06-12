import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Atlas.Tech" },
      { name: "description", content: "Atlas.Tech, la boutique tech marocaine née à Casablanca." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-5xl font-bold">Notre histoire</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Atlas.Tech est née à Casablanca avec une idée simple : rendre la tech de qualité accessible à tous au Maroc, sans intermédiaire et sans surprise.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-display text-xl font-bold text-primary">Notre mission</h3>
          <p className="mt-2 text-muted-foreground">Sélectionner les meilleurs accessoires tech, à prix juste, livrés vite.</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-display text-xl font-bold text-secondary">Nos valeurs</h3>
          <p className="mt-2 text-muted-foreground">Qualité, transparence, et un vrai service client local.</p>
        </div>
      </div>
    </div>
  );
}
