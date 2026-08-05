import * as React from "react";
import { Link } from "wouter";
import { ShoppingBag, MapPin, Package } from "lucide-react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { getUserOrders, type Order, type OrderStatus } from "@/lib/firestore";

const STATUS_CONFIG: Record<
  OrderStatus,
  { accent: string; badge: string; dot: string; label: string }
> = {
  "En attente":     { accent: "bg-amber-400",   dot: "bg-amber-400",   badge: "text-amber-700 bg-amber-50 border-amber-200",       label: "En attente" },
  "En préparation": { accent: "bg-blue-400",    dot: "bg-blue-400",    badge: "text-blue-700 bg-blue-50 border-blue-200",          label: "En préparation" },
  "Expédiée":       { accent: "bg-violet-400",  dot: "bg-violet-400",  badge: "text-violet-700 bg-violet-50 border-violet-200",    label: "Expédiée" },
  "Livrée":         { accent: "bg-emerald-500", dot: "bg-emerald-500", badge: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Livrée" },
  "Annulée":        { accent: "bg-red-400",     dot: "bg-red-400",     badge: "text-red-600 bg-red-50 border-red-200",            label: "Annulée" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function OrderSkeleton() {
  return (
    <div className="space-y-px">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border overflow-hidden animate-pulse flex">
          <div className="w-[3px] bg-muted shrink-0" />
          <div className="flex-1 px-6 py-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-5 w-24 bg-muted rounded-full" />
              </div>
              <div className="h-6 w-20 bg-muted rounded text-right" />
            </div>
            <div className="h-px bg-muted/60" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-48 bg-muted rounded" />
              <div className="h-7 w-28 bg-muted rounded" />
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

        {/* ── Section header ── */}
        <div className="mb-7 pb-5 border-b border-border flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-xl text-foreground tracking-wide">
            Mes commandes
          </h2>
          {!isLoading && orders.length > 0 && (
            <span className="text-[11px] text-muted-foreground font-sans tabular-nums">
              {orders.length} commande{orders.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Loading ── */}
        {isLoading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (

          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border bg-muted/5">
            <div className="w-12 h-12 border border-border flex items-center justify-center mb-5">
              <ShoppingBag size={20} className="text-muted-foreground" />
            </div>
            <p className="font-serif text-lg text-foreground mb-2">
              Aucune commande pour l'instant
            </p>
            <p className="text-sm text-muted-foreground mb-7 max-w-xs leading-relaxed font-sans">
              Découvrez notre sélection de créations artisanales et passez votre première commande.
            </p>
            <Link href="/boutique">
              <Button size="sm" className="text-[10px] tracking-[0.2em] uppercase font-sans px-6">
                Découvrir la boutique
              </Button>
            </Link>
          </div>

        ) : (

          /* ── Order cards ── */
          <div className="flex flex-col gap-2.5">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] ?? {
                accent: "bg-muted-foreground",
                dot:    "bg-muted-foreground",
                badge:  "text-muted-foreground bg-muted border-border",
                label:  order.status,
              };
              const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

              return (
                <Link key={order.orderId} href={`/compte/commandes/${order.orderId}`}>
                  <article className="group flex overflow-hidden border border-border bg-background hover:border-secondary/35 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-all duration-300 cursor-pointer">

                    {/* Status accent stripe */}
                    <div className={`w-[3px] shrink-0 ${cfg.accent} opacity-60 group-hover:opacity-90 transition-opacity duration-300`} />

                    {/* Card content */}
                    <div className="flex-1 px-6 py-5 min-w-0">

                      {/* ── Top section: ID + price ── */}
                      <div className="flex items-start justify-between gap-4 mb-3">

                        {/* Left: order ID + status */}
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-[15px] text-foreground tracking-wide leading-none mb-2 truncate">
                            {order.orderId}
                          </p>
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] text-[10px] font-sans font-medium border rounded-full tracking-wide whitespace-nowrap ${cfg.badge}`}>
                            <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>

                        {/* Right: price */}
                        <div className="text-right shrink-0">
                          <span className="font-serif text-xl text-foreground leading-none">
                            {order.total.toFixed(2)}
                          </span>
                          <span className="text-xs font-sans text-muted-foreground ml-1.5">د.ت</span>
                        </div>
                      </div>

                      {/* ── Divider ── */}
                      <div className="border-t border-border/60 mb-3.5" />

                      {/* ── Bottom section: meta + CTA ── */}
                      <div className="flex items-center justify-between gap-3">

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-sans leading-none">
                          <span>{formatDate(order.createdAt)}</span>
                          <span className="text-border/80">·</span>
                          <span className="flex items-center gap-1">
                            <Package size={10} className="shrink-0 opacity-70" />
                            {itemCount} article{itemCount > 1 ? "s" : ""}
                          </span>
                          {order.shipping?.city && (
                            <>
                              <span className="text-border/80">·</span>
                              <span className="flex items-center gap-1">
                                <MapPin size={10} className="shrink-0 opacity-70" />
                                {order.shipping.city}
                              </span>
                            </>
                          )}
                        </div>

                        {/* ── CTA button — elegant, brand-consistent ── */}
                        <span className="
                          shrink-0 inline-flex items-center gap-2
                          px-4 py-1.5
                          border border-secondary/30 group-hover:border-secondary/70
                          text-[10px] font-sans tracking-[0.2em] uppercase
                          text-secondary/70 group-hover:text-secondary
                          bg-transparent group-hover:bg-secondary/5
                          transition-all duration-300
                          whitespace-nowrap
                        ">
                          Voir détails
                          {/* Mini arrow ornament */}
                          <svg width="14" height="6" viewBox="0 0 14 6" fill="none" aria-hidden className="translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300">
                            <line x1="0" y1="3" x2="10" y2="3" stroke="currentColor" strokeWidth="0.75" />
                            <polyline points="8,0.5 11,3 8,5.5" stroke="currentColor" strokeWidth="0.75" fill="none" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
