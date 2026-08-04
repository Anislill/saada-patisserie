import * as React from "react";
import { Link } from "wouter";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { getUserOrders, type Order, type OrderStatus } from "@/lib/firestore";

const STATUS_COLORS: Record<OrderStatus, string> = {
  "En attente":     "bg-yellow-50 text-yellow-700 border-yellow-200",
  "En préparation": "bg-blue-50 text-blue-700 border-blue-200",
  "Expédiée":       "bg-purple-50 text-purple-700 border-purple-200",
  "Livrée":         "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Annulée":        "bg-red-50 text-red-600 border-red-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function MyOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    getUserOrders(user.uid)
      .then(setOrders)
      .catch((err) => console.error("[orders] Failed to load orders:", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <AccountLayout activeTab="commandes">
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-serif mb-8">Historique des commandes</h2>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Chargement…</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border border-border">
            <p className="text-muted-foreground mb-4">Vous n'avez pas encore passé de commande.</p>
            <Link href="/boutique"><Button>Découvrir la boutique</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-secondary transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-lg font-medium">{order.orderId}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-sm ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Passée le {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} article{order.items.reduce((n, i) => n + i.quantity, 0) > 1 ? "s" : ""} &bull; Total : {order.total.toFixed(2)} د.ت
                  </p>
                  {order.shipping?.city && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Livraison : {order.shipping.address}, {order.shipping.postalCode} {order.shipping.city}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link href={`/suivi-commande?id=${order.orderId}`}>
                    <Button variant="outline" size="sm">Suivre</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
