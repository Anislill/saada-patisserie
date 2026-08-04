import * as React from "react";
import { useLocation } from "wouter";
import { Check, Tag, X, ChevronRight, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { usePromoStore } from "@/store/promoStore";
import { useAuthStore } from "@/store/authStore";
import { getUserProfile, saveUserProfile, saveOrder, type Coupon, type OrderItem } from "@/lib/firestore";

/* ── Stepper ── */
function Stepper({ step }: { step: number }) {
  const steps = ["Informations", "Livraison", "Paiement"];
  return (
    <div className="flex items-center justify-center gap-0 max-w-xs mx-auto mt-6">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  done
                    ? "bg-[#1F3D2E] text-white"
                    : active
                    ? "bg-[#1F3D2E] text-white ring-4 ring-[#1F3D2E]/15"
                    : "bg-transparent text-[#1F3D2E]/40 border border-[#1F3D2E]/25"
                }`}
              >
                {done ? <Check size={13} strokeWidth={2.5} /> : idx}
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide uppercase hidden sm:block transition-colors ${
                  active ? "text-[#1F3D2E]" : done ? "text-[#1F3D2E]/60" : "text-[#1F3D2E]/30"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300 ${
                  step > idx ? "bg-[#1F3D2E]" : "bg-[#1F3D2E]/15"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Field wrapper ── */
function Field({
  label,
  required,
  children,
  span2,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "md:col-span-2" : ""}>
      <label className="block text-xs font-semibold uppercase tracking-widest text-[#1F3D2E]/60 mb-2">
        {label}
        {required && <span className="text-[#C9A867] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-[#1F3D2E]/15 bg-white rounded-none px-4 py-3 text-sm text-[#0F0E0D] placeholder:text-[#0F0E0D]/30 focus:outline-none focus:border-[#1F3D2E]/50 focus:ring-0 transition-colors";

/* ── Nav buttons ── */
function NavButtons({
  onBack,
  submitLabel,
  disabled,
}: {
  onBack?: () => void;
  submitLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="pt-8 border-t border-[#1F3D2E]/10 flex items-center gap-3 mt-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 h-11 px-5 rounded-full border border-[#1F3D2E]/25 text-sm font-medium text-[#1F3D2E]/70 hover:border-[#1F3D2E] hover:text-[#1F3D2E] hover:bg-[#1F3D2E]/5 transition-all duration-200 shrink-0"
        >
          <ArrowLeft size={15} />
          Retour
        </button>
      )}
      <button
        type="submit"
        disabled={disabled}
        className="flex-1 sm:flex-none sm:ml-auto h-11 px-5 sm:px-7 rounded-full bg-[#1F3D2E] text-white text-xs sm:text-sm font-semibold tracking-normal shadow-md hover:shadow-lg hover:bg-[#16301f] active:scale-[0.98] transition-all duration-200 flex items-center justify-center disabled:opacity-60"
      >
        <span className="truncate">{submitLabel}</span>
        <ChevronRight size={15} className="ml-2 shrink-0" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { items, getTotal, clearCart } = useCartStore();
  const { coupons } = usePromoStore();
  const { user } = useAuthStore();

  const [step, setStep] = React.useState(1);

  /* ── Form state ── */
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [instructions, setInstructions] = React.useState("");

  /* ── Pre-fill from Firestore when user is logged in ── */
  React.useEffect(() => {
    if (!user) return;
    // Pre-fill email from Firebase Auth immediately
    setEmail(user.email ?? "");
    // Load saved profile
    getUserProfile(user.uid).then((profile) => {
      if (!profile) return;
      if (profile.firstName) setFirstName(profile.firstName);
      if (profile.lastName) setLastName(profile.lastName);
      if (profile.phone) setPhone(profile.phone);
      if (profile.address) setAddress(profile.address);
      if (profile.postalCode) setPostalCode(profile.postalCode);
      if (profile.city) setCity(profile.city);
    });
  }, [user]);

  /* Coupon */
  const [couponInput, setCouponInput] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);
  const [couponError, setCouponError] = React.useState("");

  const total = getTotal();
  const deliveryFee = total >= 100 ? 0 : 9.9;
  const discount = appliedCoupon ? Math.round((total * appliedCoupon.discount) / 100 * 100) / 100 : 0;
  const finalTotal = total + deliveryFee - discount;

  React.useEffect(() => {
    if (items.length === 0 && step === 1) setLocation("/panier");
  }, [items, step, setLocation]);

  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = coupons.find((c) => c.code === code && c.active);
    if (!found) {
      setCouponError("Code invalide ou expiré");
      return;
    }
    if (found.minOrder > 0 && total < found.minOrder) {
      setCouponError(`Commande minimum : ${found.minOrder.toFixed(2)} د.ت`);
      return;
    }
    if (found.expiry && new Date(found.expiry) < new Date()) {
      setCouponError("Ce coupon a expiré");
      return;
    }
    setAppliedCoupon(found);
    setCouponError("");
    setCouponInput("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleConfirmOrder = async () => {
    const orderId = "CMD" + Date.now().toString().slice(-8);

    // Build order items from cart
    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      ...(item.variant ? { variant: item.variant } : {}),
    }));

    // Save order to Firestore
    if (user) {
      try {
        await saveOrder({
          orderId,
          userId: user.uid,
          userEmail: email,
          status: "En attente",
          createdAt: new Date().toISOString(),
          items: orderItems,
          subtotal: total,
          deliveryFee,
          discount,
          couponCode: appliedCoupon?.code ?? "",
          total: finalTotal,
          customer: { firstName, lastName, email, phone },
          shipping: { address, postalCode, city, instructions },
        });
        // Also save/update the customer profile
        await saveUserProfile(user.uid, { firstName, lastName, phone, address, postalCode, city });
      } catch (err) {
        console.error("[checkout] Failed to save order:", err);
      }
    }

    clearCart();
    setLocation(`/commande/confirmation?id=${orderId}`);
  };

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="bg-[#FAF9F6] border-b border-[#1F3D2E]/8 py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-serif text-[#0F0E0D] tracking-tight">Commande</h1>
          <Stepper step={step} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bg-[#FAF9F6] min-h-[60vh]">
        <div className="container mx-auto max-w-4xl px-4 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

            {/* ── Left: forms ── */}
            <div className="flex-1 min-w-0">

              {/* STEP 1 — Informations */}
              {step === 1 && (
                <form
                  onSubmit={(e) => { e.preventDefault(); goTo(2); }}
                  className="animate-in fade-in slide-in-from-bottom-3 duration-400"
                >
                  <h2 className="text-xl font-serif text-[#0F0E0D] mb-8">Vos informations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Prénom" required>
                      <input
                        className={inputCls}
                        required
                        placeholder="Prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Field>
                    <Field label="Nom" required>
                      <input
                        className={inputCls}
                        required
                        placeholder="Nom"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Field>
                    <Field label="Email" required span2>
                      <input
                        className={inputCls}
                        type="email"
                        required
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>
                    <Field label="Téléphone" required span2>
                      <input
                        className={inputCls}
                        type="tel"
                        required
                        placeholder="+216 XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Field>
                  </div>
                  <NavButtons submitLabel="Continuer vers la livraison" />
                </form>
              )}

              {/* STEP 2 — Livraison */}
              {step === 2 && (
                <form
                  onSubmit={(e) => { e.preventDefault(); goTo(3); }}
                  className="animate-in fade-in slide-in-from-bottom-3 duration-400"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-serif text-[#0F0E0D]">Livraison</h2>
                    <button
                      type="button"
                      onClick={() => goTo(1)}
                      className="text-xs text-[#1F3D2E]/50 hover:text-[#1F3D2E] underline underline-offset-2 transition-colors"
                    >
                      Modifier mes infos
                    </button>
                  </div>

                  {/* Livraison à domicile — seul mode */}
                  <div className="border border-[#1F3D2E]/20 bg-[#1F3D2E]/[0.03] p-5 mb-8 flex items-start gap-3">
                    <div className="w-4 h-4 mt-0.5 rounded-full border-2 border-[#1F3D2E] flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#1F3D2E]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#0F0E0D]">Livraison à domicile</p>
                      <p className="text-xs text-[#0F0E0D]/50 mt-0.5">
                        {deliveryFee === 0 ? "Offerte pour cette commande" : `${deliveryFee.toFixed(2)} د.ت · Livraison en 24/48h`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <Field label="Adresse" required>
                      <input
                        className={inputCls}
                        required
                        placeholder="Numéro et nom de rue"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Code Postal" required>
                        <input
                          className={inputCls}
                          required
                          placeholder="Ex: 1000"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </Field>
                      <Field label="Ville" required>
                        <input
                          className={inputCls}
                          required
                          placeholder="Ex: Tunis"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </Field>
                    </div>
                    <Field label="Instructions (optionnel)">
                      <input
                        className={inputCls}
                        placeholder="Code porte, étage, indications..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </Field>
                  </div>

                  <NavButtons onBack={() => goTo(1)} submitLabel="Continuer vers le paiement" />
                </form>
              )}

              {/* STEP 3 — Paiement */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-serif text-[#0F0E0D]">Paiement</h2>
                    <button
                      type="button"
                      onClick={() => goTo(2)}
                      className="text-xs text-[#1F3D2E]/50 hover:text-[#1F3D2E] underline underline-offset-2 transition-colors"
                    >
                      Modifier la livraison
                    </button>
                  </div>

                  <div className="border border-[#C9A867]/40 bg-[#C9A867]/5 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#C9A867]/20 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A867" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sm text-[#0F0E0D]">Paiement à la livraison</h3>
                    </div>
                    <p className="text-sm text-[#0F0E0D]/55 ml-11">
                      Vous réglez votre commande en espèces au moment de la réception.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-[#1F3D2E]/10 flex items-center gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => goTo(2)}
                      className="flex items-center gap-2 h-11 px-5 rounded-full border border-[#1F3D2E]/25 text-sm font-medium text-[#1F3D2E]/70 hover:border-[#1F3D2E] hover:text-[#1F3D2E] hover:bg-[#1F3D2E]/5 transition-all duration-200 shrink-0"
                    >
                      <ArrowLeft size={15} />
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmOrder}
                      className="flex-1 sm:flex-none sm:ml-auto h-11 px-7 rounded-full bg-[#1F3D2E] text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg hover:bg-[#16301f] active:scale-[0.98] flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      Confirmer la commande
                      <Check size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: order summary ── */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="border border-[#1F3D2E]/10 bg-white p-6 sticky top-24">
                <h3 className="font-serif text-lg text-[#0F0E0D] mb-5">Votre commande</h3>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 shrink-0 bg-[#FAF9F6] border border-[#1F3D2E]/8 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0F0E0D] line-clamp-2 leading-snug">{item.name}</p>
                        <p className="text-xs text-[#0F0E0D]/40 mt-1">Qté : {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-[#0F0E0D] shrink-0">
                        {(item.price * item.quantity).toFixed(2)} د.ت
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon input */}
                <div className="border-t border-[#1F3D2E]/8 pt-5 mb-5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#1F3D2E]/5 border border-[#1F3D2E]/15 px-3 py-2.5 rounded-sm">
                      <div className="flex items-center gap-2">
                        <Tag size={13} className="text-[#1F3D2E]" />
                        <span className="text-xs font-semibold font-mono text-[#1F3D2E]">{appliedCoupon.code}</span>
                        <span className="text-xs text-[#1F3D2E]/60">−{appliedCoupon.discount}%</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[#0F0E0D]/30 hover:text-[#8A2E2E] transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-[#1F3D2E]/50">
                        Code promo
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                          placeholder="Entrez votre code"
                          className="flex-1 border border-[#1F3D2E]/15 bg-[#FAF9F6] px-3 py-2 text-xs font-mono placeholder:text-[#0F0E0D]/25 focus:outline-none focus:border-[#1F3D2E]/40 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="px-3 py-2 bg-[#1F3D2E]/8 hover:bg-[#1F3D2E]/15 text-[#1F3D2E] text-xs font-semibold transition-colors"
                        >
                          Appliquer
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-[#8A2E2E]">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="border-t border-[#1F3D2E]/8 pt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-[#0F0E0D]/55">
                    <span>Sous-total</span>
                    <span>{total.toFixed(2)} د.ت</span>
                  </div>
                  <div className="flex justify-between text-[#0F0E0D]/55">
                    <span>Livraison</span>
                    <span className={deliveryFee === 0 ? "text-[#1F3D2E] font-medium" : ""}>
                      {deliveryFee === 0 ? "Offerte" : `${deliveryFee.toFixed(2)} د.ت`}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-[#1F3D2E] font-medium">
                      <span>Réduction ({appliedCoupon.discount}%)</span>
                      <span>−{discount.toFixed(2)} د.ت</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#1F3D2E]/8 mt-4 pt-4 flex justify-between items-baseline">
                  <span className="font-serif text-base text-[#0F0E0D]">Total</span>
                  <span className="font-serif text-2xl text-[#0F0E0D]">{finalTotal.toFixed(2)} <span className="text-lg">د.ت</span></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
