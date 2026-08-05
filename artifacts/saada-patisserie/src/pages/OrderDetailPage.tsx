import * as React from "react";
import { useLocation, Link } from "wouter";
import {
  Clock, CheckCircle2, Package, Truck, XCircle,
  MapPin, ChevronLeft, ShoppingBag,
} from "lucide-react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { subscribeToOrder, type Order, type OrderStatus } from "@/lib/firestore";

/* ── Helpers ──────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Tracking steps ───────────────────────────────────────────── */

type Step = {
  id: number;
  status: OrderStatus;
  label: string;
  sublabel: string;
  icon: React.ElementType;
};

const STEPS: Step[] = [
  { id: 1, status: "En attente",     label: "Commande reçue",   sublabel: "Votre commande a été confirmée", icon: CheckCircle2 },
  { id: 2, status: "En préparation", label: "En préparation",   sublabel: "Nos artisans préparent vos créations", icon: Package },
  { id: 3, status: "Expédiée",       label: "En livraison",     sublabel: "Votre commande est en route",    icon: Truck },
  { id: 4, status: "Livrée",         label: "Livrée",           sublabel: "Commande livrée avec succès",    icon: CheckCircle2 },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  "En attente":     1,
  "En préparation": 2,
  "Expédiée":       3,
  "Livrée":         4,
  "Annulée":        0,
};

function GoldOrnament() {
  return (
    <svg width="60" height="8" viewBox="0 0 60 8" fill="none" aria-hidden>
      <line x1="0" y1="4" x2="20" y2="4" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="30" cy="4" r="3" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="30" cy="4" r="1.2" fill="#C9A867" />
      <line x1="40" y1="4" x2="60" y2="4" stroke="#C9A867" strokeWidth="0.75" />
    </svg>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────── */
function OrderSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-64 bg-muted rounded" />
      <div className="h-4 w-40 bg-muted rounded" />
      <div className="h-40 bg-muted rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-48 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function OrderDetailPage({ params }: { params?: { orderId?: string } }) {
  const [location] = useLocation();
  const { user } = useAuthStore();

  // Support both route param (/compte/commandes/:orderId) and query (?id=...)
  const orderId = params?.orderId
    ?? new URLSearchParams(location.split("?")[1] ?? "").get("id")
    ?? "";

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!orderId) { setLoading(false); setNotFound(true); return; }
    setLoading(true);
    const unsub = subscribeToOrder(
      orderId,
      (o) => {
        setLoading(false);
        if (!o) { setNotFound(true); return; }
        // Security: ensure the order belongs to the current user
        if (user && o.userId && o.userId !== user.uid) { setNotFound(true); return; }
        setNotFound(false);
        setOrder(o);
      },
      () => { setLoading(false); setNotFound(true); }
    );
    return unsub;
  }, [orderId, user]);

  /* ── Loading ── */
  if (loading) {
    return (
      <AccountLayout activeTab="commandes">
        <OrderSkeleton />
      </AccountLayout>
    );
  }

  /* ── Not found ── */
  if (notFound || !order) {
    return (
      <AccountLayout activeTab="commandes">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <ShoppingBag size={22} className="text-muted-foreground" />
          </div>
          <p className="font-serif text-xl mb-2">Commande introuvable</p>
          <p className="text-sm text-muted-foreground mb-6">Cette commande n'existe pas ou ne vous appartient pas.</p>
          <Link href="/compte/commandes">
            <Button variant="outline" size="sm">← Retour aux commandes</Button>
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const isCancelled = order.status === "Annulée";
  const currentStep = STATUS_ORDER[order.status] ?? 0;
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <AccountLayout activeTab="commandes">
      <div className="max-w-3xl animate-in fade-in duration-500">

        {/* ── Back link ── */}
        <Link href="/compte/commandes" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-secondary transition-colors mb-6 font-sans tracking-wide uppercase">
          <ChevronLeft size={14} /> Mes commandes
        </Link>

        {/* ── Order header (luxury masthead) ── */}
        <div className="relative bg-primary overflow-hidden mb-8">
          {/* Texture */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #C9A867 0px, #C9A867 1px, transparent 1px, transparent 14px)`,
            }}
          />
          {/* Corner marks */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-secondary/30" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-secondary/30" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-secondary/30" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-secondary/30" />

          <div className="relative px-8 py-8 text-center">
            <p className="text-secondary/70 text-[10px] font-sans tracking-[0.4em] uppercase mb-3">
              Détail de commande
            </p>
            <h1 className="text-primary-foreground font-serif text-2xl md:text-3xl mb-1">
              {order.orderId}
            </h1>
            <div className="flex justify-center my-3">
              <GoldOrnament />
            </div>
            <p className="text-primary-foreground/50 text-xs font-sans">
              {formatDate(order.createdAt)} à {formatTime(order.createdAt)}
            </p>

            {/* Status badge */}
            <div className="mt-4 flex justify-center">
              {isCancelled ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-900/30 border border-red-400/30 text-red-300 text-xs font-sans tracking-widest uppercase">
                  <XCircle size={13} /> Annulée
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/15 border border-secondary/30 text-secondary text-xs font-sans tracking-widest uppercase">
                  <Clock size={13} /> {order.status}
                </span>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-secondary/20" />
        </div>

        {/* ── Tracking timeline ── */}
        {!isCancelled && (
          <div className="border border-border bg-background mb-6 px-8 py-7">
            <h2 className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-6">
              Suivi de livraison
            </h2>

            {/* Progress bar */}
            <div className="relative mb-8 hidden sm:block">
              <div className="absolute top-5 left-5 right-5 h-px bg-border" />
              <div
                className="absolute top-5 left-5 h-px bg-secondary transition-all duration-700"
                style={{ width: `${Math.max(0, ((currentStep - 1) / 3)) * 100}%`, right: "auto" }}
              />
              <div className="relative flex justify-between">
                {STEPS.map((step) => {
                  const done = currentStep >= step.id;
                  const active = currentStep === step.id;
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 w-1/4">
                      <div className={`w-10 h-10 flex items-center justify-center border transition-all duration-500 z-10 bg-background
                        ${done ? "border-secondary bg-secondary/10" : "border-border"}
                        ${active ? "ring-2 ring-secondary/30 ring-offset-2 ring-offset-background" : ""}
                      `}>
                        <Icon size={16} className={done ? "text-secondary" : "text-muted-foreground"} />
                      </div>
                      <span className={`text-[10px] font-sans tracking-wide text-center leading-tight ${done ? "text-secondary" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: vertical list */}
            <div className="sm:hidden space-y-4">
              {STEPS.map((step) => {
                const done = currentStep >= step.id;
                const active = currentStep === step.id;
                const Icon = step.icon;
                return (
                  <div key={step.id} className={`flex items-start gap-4 ${done ? "opacity-100" : "opacity-40"}`}>
                    <div className={`w-8 h-8 flex items-center justify-center border shrink-0
                      ${done ? "border-secondary bg-secondary/10" : "border-border"}
                      ${active ? "ring-2 ring-secondary/30 ring-offset-1 ring-offset-background" : ""}
                    `}>
                      <Icon size={14} className={done ? "text-secondary" : "text-muted-foreground"} />
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                      {active && <p className="text-xs text-muted-foreground mt-0.5">{step.sublabel}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current step description */}
            {currentStep > 0 && (
              <p className="hidden sm:block text-xs text-center text-muted-foreground mt-2">
                {STEPS.find(s => s.id === currentStep)?.sublabel}
              </p>
            )}
          </div>
        )}

        {/* ── Cancelled notice ── */}
        {isCancelled && (
          <div className="border border-red-200 bg-red-50 px-6 py-5 flex items-start gap-3 mb-6">
            <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Commande annulée</p>
              <p className="text-xs text-red-500 mt-0.5">Cette commande a été annulée. Pour toute question, contactez-nous.</p>
            </div>
          </div>
        )}

        {/* ── Items + Summary grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">

          {/* Items list */}
          <div className="md:col-span-3 border border-border bg-background">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xs font-sans uppercase tracking-widest text-muted-foreground">
                Articles · {itemCount} article{itemCount > 1 ? "s" : ""}
              </h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 px-6 py-4">
                  {/* Qty badge */}
                  <div className="w-7 h-7 bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs font-sans text-muted-foreground">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                    )}
                  </div>
                  <div className="text-sm font-medium text-foreground shrink-0">
                    {(item.price * item.quantity).toFixed(2)} <span className="text-xs text-muted-foreground">د.ت</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-2 border border-border bg-background">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xs font-sans uppercase tracking-widest text-muted-foreground">
                Récapitulatif
              </h2>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{order.subtotal?.toFixed(2) ?? "—"} <span className="text-xs text-muted-foreground">د.ت</span></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span>
                  {order.deliveryFee === 0
                    ? <span className="text-secondary text-xs font-medium tracking-wide uppercase">Offerte</span>
                    : <>{order.deliveryFee?.toFixed(2)} <span className="text-xs text-muted-foreground">د.ت</span></>
                  }
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Remise {order.couponCode && <span className="text-xs text-secondary">({order.couponCode})</span>}
                  </span>
                  <span className="text-secondary">−{order.discount?.toFixed(2)} <span className="text-xs">د.ت</span></span>
                </div>
              )}
              <div className="border-t border-border pt-3 mt-3 flex justify-between">
                <span className="font-serif text-base text-foreground">Total</span>
                <span className="font-serif text-lg text-foreground">
                  {order.total.toFixed(2)} <span className="text-sm font-sans text-muted-foreground">د.ت</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Shipping address ── */}
        {order.shipping?.address && (
          <div className="border border-border bg-background px-6 py-5 flex items-start gap-4">
            <div className="w-8 h-8 bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-secondary" />
            </div>
            <div>
              <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-1">
                Adresse de livraison
              </p>
              <p className="text-sm font-medium text-foreground">
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shipping.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shipping.postalCode} {order.shipping.city}
              </p>
              {order.shipping.instructions && (
                <p className="text-xs text-muted-foreground/70 mt-1 italic">
                  {order.shipping.instructions}
                </p>
              )}
              {order.customer?.phone && (
                <p className="text-xs text-muted-foreground mt-1">{order.customer.phone}</p>
              )}
            </div>
          </div>
        )}

      </div>
    </AccountLayout>
  );
}
