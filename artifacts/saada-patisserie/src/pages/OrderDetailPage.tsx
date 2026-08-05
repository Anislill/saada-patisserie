import * as React from "react";
import { useLocation, Link } from "wouter";
import {
  Clock, CheckCircle2, Package, Truck, XCircle,
  MapPin, CalendarDays, ChevronLeft, ShoppingBag,
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
    <svg width="72" height="10" viewBox="0 0 72 10" fill="none" aria-hidden>
      <line x1="0" y1="5" x2="26" y2="5" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="36" cy="5" r="3.5" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="36" cy="5" r="1.4" fill="#C9A867" />
      <line x1="46" y1="5" x2="72" y2="5" stroke="#C9A867" strokeWidth="0.75" />
    </svg>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────── */
function OrderSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-6 w-32 bg-muted rounded" />
      <div className="h-52 bg-muted" />
      <div className="h-36 bg-muted" />
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 h-56 bg-muted" />
        <div className="col-span-2 h-56 bg-muted" />
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function OrderDetailPage({ params }: { params?: { orderId?: string } }) {
  const [location] = useLocation();
  const { user } = useAuthStore();

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
        if (user && o.userId && o.userId !== user.uid) { setNotFound(true); return; }
        setNotFound(false);
        setOrder(o);
      },
      () => { setLoading(false); setNotFound(true); }
    );
    return unsub;
  }, [orderId, user]);

  if (loading) {
    return <AccountLayout activeTab="commandes"><OrderSkeleton /></AccountLayout>;
  }

  if (notFound || !order) {
    return (
      <AccountLayout activeTab="commandes">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 border border-border flex items-center justify-center mb-5">
            <ShoppingBag size={22} className="text-muted-foreground" />
          </div>
          <p className="font-serif text-xl text-foreground mb-2">Commande introuvable</p>
          <p className="text-sm text-muted-foreground mb-7 max-w-xs leading-relaxed">
            Cette commande n'existe pas ou ne vous appartient pas.
          </p>
          <Link href="/compte/commandes">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs tracking-widest uppercase font-sans">
              <ChevronLeft size={13} /> Mes commandes
            </Button>
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

        {/* Back link */}
        <Link
          href="/compte/commandes"
          className="inline-flex items-center gap-1.5 text-[11px] font-sans tracking-[0.2em] uppercase text-muted-foreground hover:text-secondary transition-colors duration-200 mb-7"
        >
          <ChevronLeft size={13} /> Mes commandes
        </Link>

        {/* ── Luxury masthead ── */}
        <div className="relative bg-primary overflow-hidden mb-6">
          {/* Diagonal texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #C9A867 0px, #C9A867 1px, transparent 1px, transparent 16px)`,
            }}
          />
          {/* Corner marks */}
          <div className="absolute top-5 left-5 w-5 h-5 border-t border-l border-secondary/25" />
          <div className="absolute top-5 right-5 w-5 h-5 border-t border-r border-secondary/25" />
          <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l border-secondary/25" />
          <div className="absolute bottom-5 right-5 w-5 h-5 border-b border-r border-secondary/25" />

          <div className="relative px-10 py-10 text-center">
            <p className="text-secondary/60 text-[10px] font-sans tracking-[0.45em] uppercase mb-4">
              Commande
            </p>
            <h1 className="text-primary-foreground font-serif text-2xl md:text-3xl tracking-wide mb-1">
              {order.orderId}
            </h1>
            <div className="flex justify-center my-4">
              <GoldOrnament />
            </div>
            <p className="text-primary-foreground/45 text-xs font-sans tracking-wide">
              {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
            </p>

            {/* Status pill */}
            <div className="mt-5 flex justify-center">
              {isCancelled ? (
                <span className="inline-flex items-center gap-2 px-5 py-1.5 bg-red-900/25 border border-red-400/30 text-red-300 text-[10px] font-sans tracking-[0.3em] uppercase">
                  <XCircle size={12} /> Annulée
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-5 py-1.5 bg-secondary/10 border border-secondary/25 text-secondary text-[10px] font-sans tracking-[0.3em] uppercase">
                  <Clock size={12} /> {order.status}
                </span>
              )}
            </div>
          </div>

          {/* Bottom gold rule */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-secondary/20" />
        </div>

        {/* ── Tracking timeline ── */}
        {!isCancelled && (
          <div className="border border-border bg-background mb-5 px-8 py-7">
            <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-7">
              Suivi de livraison
            </p>

            {/* Desktop progress */}
            <div className="relative mb-6 hidden sm:block">
              {/* Background rail */}
              <div className="absolute top-5 left-5 right-5 h-px bg-border" />
              {/* Filled rail */}
              <div
                className="absolute top-5 left-5 h-px bg-secondary/70 transition-all duration-700"
                style={{ width: `calc(${Math.max(0, (currentStep - 1) / 3) * 100}% * (100% - 2.5rem) / 100%)` }}
              />
              <div className="relative flex justify-between">
                {STEPS.map((step) => {
                  const done = currentStep >= step.id;
                  const active = currentStep === step.id;
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2.5 w-1/4">
                      <div
                        className={`w-10 h-10 flex items-center justify-center border transition-all duration-500 z-10 bg-background
                          ${done ? "border-secondary/60 bg-secondary/8" : "border-border"}
                          ${active ? "ring-2 ring-secondary/20 ring-offset-2 ring-offset-background shadow-sm" : ""}
                        `}
                      >
                        <Icon
                          size={15}
                          className={done ? "text-secondary" : "text-muted-foreground/40"}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-sans tracking-wide text-center leading-snug transition-colors duration-300
                          ${done ? "text-secondary" : "text-muted-foreground/40"}
                          ${active ? "font-medium" : ""}
                        `}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current step sublabel */}
            {currentStep > 0 && (
              <p className="hidden sm:block text-xs text-center text-muted-foreground font-sans">
                {STEPS.find((s) => s.id === currentStep)?.sublabel}
              </p>
            )}

            {/* Mobile vertical list */}
            <div className="sm:hidden space-y-4">
              {STEPS.map((step) => {
                const done = currentStep >= step.id;
                const active = currentStep === step.id;
                const Icon = step.icon;
                return (
                  <div key={step.id} className={`flex items-start gap-4 transition-opacity duration-300 ${done ? "opacity-100" : "opacity-30"}`}>
                    <div
                      className={`w-8 h-8 flex items-center justify-center border shrink-0 transition-all duration-300
                        ${done ? "border-secondary/60 bg-secondary/8" : "border-border"}
                        ${active ? "ring-2 ring-secondary/20 ring-offset-1 ring-offset-background" : ""}
                      `}
                    >
                      <Icon size={13} className={done ? "text-secondary" : "text-muted-foreground"} />
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {active && (
                        <p className="text-xs text-muted-foreground mt-0.5 font-sans">{step.sublabel}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cancelled notice ── */}
        {isCancelled && (
          <div className="border border-red-200 bg-red-50/60 px-6 py-5 flex items-start gap-3.5 mb-5">
            <XCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-serif text-red-700 mb-0.5">Commande annulée</p>
              <p className="text-xs text-red-500 font-sans leading-relaxed">
                Cette commande a été annulée. Pour toute question, n'hésitez pas à nous contacter.
              </p>
            </div>
          </div>
        )}

        {/* ── Items + Summary grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">

          {/* Items list */}
          <div className="md:col-span-3 border border-border bg-background">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground">
                Articles
              </h2>
              <span className="text-[10px] font-sans text-muted-foreground">
                {itemCount} article{itemCount > 1 ? "s" : ""}
              </span>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 px-6 py-4">
                  {/* Qty */}
                  <div className="w-7 h-7 bg-muted/60 border border-border flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-sans font-medium text-muted-foreground">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Name + variant */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {item.variant && (
                      <p className="text-[11px] text-muted-foreground font-sans mt-0.5">{item.variant}</p>
                    )}
                  </div>

                  {/* Line total */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-serif text-foreground">
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground font-sans ml-1">د.ت</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-2 border border-border bg-background flex flex-col">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground">
                Récapitulatif
              </h2>
            </div>

            <div className="px-6 py-5 flex-1 space-y-3">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-muted-foreground font-sans">Sous-total</span>
                <span className="font-sans">
                  {order.subtotal?.toFixed(2) ?? "—"}
                  <span className="text-xs text-muted-foreground ml-1">د.ت</span>
                </span>
              </div>

              <div className="flex justify-between items-baseline text-sm">
                <span className="text-muted-foreground font-sans">Livraison</span>
                <span>
                  {order.deliveryFee === 0 ? (
                    <span className="text-secondary text-[10px] font-sans font-medium tracking-widest uppercase">
                      Offerte
                    </span>
                  ) : (
                    <>
                      <span className="font-sans">{order.deliveryFee?.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground ml-1">د.ت</span>
                    </>
                  )}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-muted-foreground font-sans">
                    Remise
                    {order.couponCode && (
                      <span className="text-[10px] text-secondary ml-1 font-sans">({order.couponCode})</span>
                    )}
                  </span>
                  <span className="text-secondary font-sans">
                    −{order.discount?.toFixed(2)}
                    <span className="text-xs ml-1">د.ت</span>
                  </span>
                </div>
              )}
            </div>

            {/* Total — visually separated and prominent */}
            <div className="px-6 py-5 border-t border-border bg-muted/5">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-base text-foreground tracking-wide">Total</span>
                <div className="text-right">
                  <span className="font-serif text-2xl text-foreground tracking-wide">
                    {order.total.toFixed(2)}
                  </span>
                  <span className="text-sm font-sans text-muted-foreground ml-1.5">د.ت</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Requested date + Shipping address ── */}
        <div className="flex flex-col gap-4">

          {/* Requested date */}
          {order.requestedDate && (
            <div className="border border-secondary/25 bg-secondary/5 px-6 py-5 flex items-start gap-4">
              <div className="w-9 h-9 bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                <CalendarDays size={14} className="text-secondary" />
              </div>
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-1.5">
                  Date de réception souhaitée
                </p>
                <p className="text-base font-serif text-foreground">
                  {new Date(order.requestedDate).toLocaleDateString("fr-FR", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Shipping address */}
          {order.shipping?.address && (
            <div className="border border-border bg-background px-6 py-5 flex items-start gap-4">
              <div className="w-9 h-9 bg-secondary/8 border border-secondary/20 flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-secondary" />
              </div>
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  Adresse de livraison
                </p>
                <p className="text-sm font-medium text-foreground font-serif">
                  {order.customer?.firstName} {order.customer?.lastName}
                </p>
                <p className="text-sm text-muted-foreground font-sans mt-0.5">
                  {order.shipping.address}
                </p>
                <p className="text-sm text-muted-foreground font-sans">
                  {order.shipping.postalCode} {order.shipping.city}
                </p>
                {order.shipping.instructions && (
                  <p className="text-xs text-muted-foreground/70 mt-2 italic font-sans leading-relaxed">
                    {order.shipping.instructions}
                  </p>
                )}
                {order.customer?.phone && (
                  <p className="text-xs text-muted-foreground font-sans mt-1.5 tracking-wide">
                    {order.customer.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </AccountLayout>
  );
}
