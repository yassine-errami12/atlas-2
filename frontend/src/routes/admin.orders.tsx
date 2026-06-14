import { createFileRoute } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrdersStore, type OrderStatus, type PaymentMethod } from "@/store/orders";
import { formatMAD } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const statusColor: Record<OrderStatus, string> = {
  pending: "bg-accent/20 text-accent-foreground",
  shipped: "bg-secondary/20 text-secondary",
  delivered: "bg-primary/20 text-primary",
};

const paymentLabel: Record<PaymentMethod, string> = {
  COD: "Cash a la livraison",
  CARD: "Paiement en ligne",
};
function AdminOrders() {
  const orders = useOrdersStore((s) => s.orders);
  const setStatus = useOrdersStore((s) => s.setStatus);

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold">Commandes ({orders.length})</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          Aucune commande pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold">{o.id}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[o.status]}`}
                    >
                      {o.status}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {paymentLabel[o.paymentMethod]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString("fr-FR")} · {o.customer.name} ·{" "}
                    {o.customer.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {o.customer.address}, {o.customer.city}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-bold text-primary">
                    {formatMAD(o.total)}
                  </div>
                  <Select
                    value={o.status}
                    onValueChange={(v) => {
                      setStatus(o.id, v as OrderStatus);
                      toast.success("Statut mis à jour");
                    }}
                  >
                    <SelectTrigger className="mt-2 w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="shipped">Expédiée</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3 border-t pt-3 text-sm">
                {o.items.map((i) => (
                  <div key={i.productId} className="flex justify-between text-muted-foreground">
                    <span>
                      {i.quantity}× {i.title}
                    </span>
                    <span>{formatMAD(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
