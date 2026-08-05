import * as React from "react";
import { Link } from "wouter";
import { ShoppingBag, MapPin, Package, ArrowRight } from "lucide-react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { getUserOrders, type Order, type OrderStatus } from "@/lib/firestore";

const STATUS_CONFIG: Record<
  OrderStatus,
  { accent: string; badge: string; dot: string; label: string }
> = {
  "En attente":     { accent: "bg-amber-400",   dot: "bg-amber-400",   badge: "text-amber-700 bg-amber-50 border-amber-200",          label: "En attente" },
  "En préparation": { accent: "bg-blue-400",    dot: "bg-blue-400",    badge: "text-blue-700 bg-blue-50 border-blue-200",             label: "En préparation" },
  "Expédiée":       { accent: "bg-violet-400",  dot: "bg-violet-400",  badge: "text-violet-700 bg-violet-50 border-violet-200",       label: "Expédiée" },
  "Livrée":         { accent: "bg-emerald-500", dot: "bg-emerald-500", badge: "text-emerald-700 bg-emerald-50 border-emerald-200",    label: "Livrée" },
  "Annulée":        { accent: "bg-red-400",     dot: "bg-red-400",     badge: "text-red-600 bg-red-50 border-red-200",               label: "Annulée" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border rounded-none overflow-hidden animate-pulse flex">
          <div className="w-1 bg-muted shrink-0" />
          <div className="flex-1 p-6 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
              <div className="h-6 w-20 bg-muted rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 w-28 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
            </div>
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

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-border">
          <h2 className="text-2xl font-serif text-foreground tracking-wide">
            Historique des commandes
          </h2>
          {!isLoading && orders.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1.5 font-sans">
              {orders.length} commande{orders.length > 1 ? "s" : ""} passée{orders.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (

          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border bg-muted/5">
            <div className="w-14 h-14 border border-border flex items-center justify-center mb-5">
              <ShoppingBag size={22} className="text-muted-foreground" />
            </div>
            <p className="font-serif text-lg text-foreground mb-2">Aucune commande pour l'instant</p>
            <p className="text-sm text-muted-foreground mb-7 max-w-xs leading-relaxed">
              Découvrez notre sélection de créations artisanales et passez votre première commande.
            </p>
            <Link href="/boutique">
              <Button size="sm" className="tracking-widest text-xs uppercase font-sans">
                Découvrir la boutique
              </Button>
            </Link>
          </div>

        ) : (

          /* Order cards */
          <div className="space-y-3">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] ?? {
                accent: "bg-muted-foreground",
                dot: "bg-muted-foreground",
                badge: "text-muted-foreground bg-muted border-border",
                label: order.status,
              };
              const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

              return (
                <Link key={order.orderId} href={`/compte/commandes/${order.orderId}`}>
                  <div className="group border border-border hover:border-secondary/40 hover:shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex cursor-pointer bg-background">

                    {/* Status accent stripe */}
                    <div className={`w-[3px] shrink-0 ${cfg.accent} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Card body */}
                    <div className="flex-1 px-6 py-5">

                      {/* Top row: order ID + status badge */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-serif text-base font-medium text-foreground tracking-wide truncate">
                            {order.orderId}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-sans font-medium border rounded-full tracking-wide whitespace-nowrap ${cfg.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>

                        {/* Price — prominent */}
                        <span className="font-serif text-lg text-foreground shrink-0">
                          {order.total.toFixed(2)}
                          <span className="text-sm font-sans text-muted-foreground ml-1">د.ت</span>
                        </span>
                      </div>

                      {/* Bottom row: meta + CTA */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-sans">
                          {/* Date */}
                          <span>{formatDate(order.createdAt)}</span>

                          <span className="text-border">·</span>

                          {/* Item count */}
                          <span className="flex items-center gap-1">
                            <Package size={11} className="shrink-0" />
                            {itemCount} article{itemCount > 1 ? "s" : ""}
                          </span>

                          {/* City */}
                          {order.shipping?.city && (
                            <>
                              <span className="text-border">·</span>
                              <span className="flex items-center gap-1">
                                <MapPin size={11} className="shrink-0" />
                                {order.shipping.city}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Arrow CTA */}
                        <span className="flex items-center gap-1 text-xs font-sans text-muted-foreground group-hover:text-secondary transition-colors duration-200 tracking-wide">
                          Détails
                          <ArrowRight size={13} className="translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
