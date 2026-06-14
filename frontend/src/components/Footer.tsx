export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary text-secondary-foreground">
      <div className="zellige-border h-1" />
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-bold">
              A
            </div>
            <span className="font-display text-xl font-bold">Atlas.Tech</span>
          </div>
          <p className="mt-3 text-sm opacity-80">
            La boutique tech préférée du Maroc. Livraison partout, paiement à la livraison.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-80">
            Boutique
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Audio</li>
            <li>Wearables</li>
            <li>Charge</li>
            <li>Gaming</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-80">Aide</h4>
          <ul className="space-y-2 text-sm">
            <li>Livraison & retours</li>
            <li>Garantie 1 an</li>
            <li>Nous contacter</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-80">
            Contact
          </h4>
          <p className="text-sm opacity-80">
            Casablanca, Maroc
            <br />
            +212 6 00 00 00 00
            <br />
            contact@atlas.ma
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Atlas.Tech — Tous droits réservés
      </div>
    </footer>
  );
}
