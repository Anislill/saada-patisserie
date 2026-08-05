import * as React from "react";
import { Link } from "wouter";
import { ShoppingBag, MapPin, Package, ChevronRight } from "lucide-react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { getUserOrders, type Order, type OrderStatus } from "@/lib/firestore";

const STATUS_CONFIG: Record<OrderStatus, { dot: string; badge: string; label: string }> = {
  "En attente":     { dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",    label: "En attente" },
  "En préparation": { dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 border-blue-200",       label: "En préparation" },
  "Expédiée":       { dot: "bg-violet-400",  badge: "bg-violet-50 text-violet-700 border-violet-200", label: "Expédiée" },
  "Livrée":         { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Livrée" },
  "Annulée":        { dot: "bg-red-400",     badge: "bg-red-50 text-red-600 border-red-200",          label: "Annulée" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function OrderSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map(i => (
        <div key={i} className="border border-border rounded-lg p-5 animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded-full" />
              </div>
              <div className="h-3 w-40 bg-muted rounded" />
              <div className="h-3 w-28 bg-muted rounded" />
            </div>
            <div className="h-8 w-20 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
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
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-foreground">Historique des commandes</h2>
          {!isLoading && orders.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {orders.length} commande{orders.length > 1 ? "s" : ""} passée{orders.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {isLoading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg bg-muted/10">
            <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-1">Aucune commande pour l'instant</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Découvrez notre boutique et passez votre première commande.
            </p>
            <Link href="/boutique">
              <Button size="sm">Découvrir la boutique</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] ?? {
                dot: "bg-muted-foreground",
                badge: "bg-muted text-muted-foreground border-border",
                label: order.status,
              };
              const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

              return (
                <div
                  key={order.orderId}
                  className="border border-border rounded-lg p-5 hover:border-secondary/50 hover:shadow-sm transition-all bg-background"
                >
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Order ID + status */}
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="font-serif font-medium text-foreground text-base truncate">
                          {order.orderId}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border rounded-full ${statusCfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </div>

                      {/* Date */}
                      <p className="text-sm text-muted-foreground mb-1.5">
                        Passée le {formatDate(order.createdAt)}
                      </p>

                      {/* Items + total */}
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Package size={13} className="shrink-0" />
                        <span>
                          {itemCount} article{itemCount > 1 ? "s" : ""}
                          <span className="mx-1.5 text-border">·</span>
                          <span className="font-medium text-foreground">{order.total.toFixed(2)} د.ت</span>
                        </span>
                      </div>

                      {/* Delivery address */}
                      {order.shipping?.city && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                          <MapPin size={12} className="shrink-0" />
                          <span>{order.shipping.address}, {order.shipping.postalCode} {order.shipping.city}</span>
                        </div>
                      )}
                    </div>

                    {/* Track button */}
                    <Link href={`/compte/commandes/${order.orderId}`} className="shrink-0">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        Suivre
                        <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
