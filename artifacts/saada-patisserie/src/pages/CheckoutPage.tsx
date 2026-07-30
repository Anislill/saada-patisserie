import * as React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Check, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = React.useState(1);
  const [deliveryMode, setDeliveryMode] = React.useState("home");

  const total = getTotal();
  const deliveryFee = deliveryMode === "home" ? (total > 100 ? 0 : 9.90) : 0;
  const finalTotal = total + deliveryFee;

  React.useEffect(() => {
    if (items.length === 0 && step === 1) {
      setLocation("/panier");
    }
  }, [items, step, setLocation]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleConfirmOrder = () => {
    clearCart();
    setLocation("/commande/confirmation");
  };

  return (
    <Layout>
      <div className="bg-muted/30 py-8">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6">{t('checkout.title')}</h1>
          
          <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                {step > 1 ? <Check size={12} /> : "1"}
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">{t('checkout.step1')}</span>
            </div>
            <div className={`flex-1 h-px ${step >= 2 ? 'bg-foreground' : 'bg-border'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                {step > 2 ? <Check size={12} /> : "2"}
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">{t('checkout.step2')}</span>
            </div>
            <div className={`flex-1 h-px ${step >= 3 ? 'bg-foreground' : 'bg-border'}`} />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">{t('checkout.step3')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="w-full lg:w-2/3">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-serif mb-6">{t('checkout.step1')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('checkout.firstName')} *</label>
                    <Input required placeholder="Votre prénom" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('checkout.lastName')} *</label>
                    <Input required placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">{t('checkout.email')} *</label>
                    <Input type="email" required placeholder="vous@exemple.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">{t('checkout.phone')} *</label>
                    <Input type="tel" required placeholder="+33 6 00 00 00 00" />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border flex justify-end">
                  <Button type="submit" size="lg">
                    Continuer vers la livraison <ChevronRight size={18} className="ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif">{t('checkout.step2')}</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-muted-foreground underline">Modifier mes infos</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <label className={`border p-4 cursor-pointer transition-colors ${deliveryMode === 'home' ? 'border-secondary bg-secondary/5' : 'border-border hover:border-foreground'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <input type="radio" name="delivery" checked={deliveryMode === 'home'} onChange={() => setDeliveryMode('home')} className="accent-secondary" />
                      <span className="font-medium">{t('checkout.homeDelivery')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">Livraison en 24/48h via coursier réfrigéré.</p>
                  </label>
                  <label className={`border p-4 cursor-pointer transition-colors ${deliveryMode === 'pickup' ? 'border-secondary bg-secondary/5' : 'border-border hover:border-foreground'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <input type="radio" name="delivery" checked={deliveryMode === 'pickup'} onChange={() => setDeliveryMode('pickup')} className="accent-secondary" />
                      <span className="font-medium">{t('checkout.storePickup')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">Gratuit. Retrait en boutique le jour même.</p>
                  </label>
                </div>

                {deliveryMode === "home" ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('checkout.address')} *</label>
                      <Input required placeholder="Numéro et nom de rue" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('checkout.postalCode')} *</label>
                        <Input required placeholder="Ex: 75001" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('checkout.city')} *</label>
                        <Input required placeholder="Ex: Paris" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Instructions (optionnel)</label>
                      <Input placeholder="Code porte, étage, bâtiment..." />
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted p-6 text-sm">
                    <h4 className="font-medium mb-2">Boutique Saada Saint-Honoré</h4>
                    <p className="text-muted-foreground mb-4">123 rue Saint-Honoré, 75001 Paris<br/>Ouvert du Mardi au Dimanche (10h - 19h)</p>
                    <div className="space-y-2 max-w-sm">
                      <label className="text-sm font-medium">Date et heure de retrait souhaitées *</label>
                      <Input type="datetime-local" required />
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-muted-foreground hover:text-foreground">Retour</button>
                  <Button type="submit" size="lg">
                    Continuer vers le paiement <ChevronRight size={18} className="ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif">Paiement</h2>
                  <button type="button" onClick={() => setStep(2)} className="text-sm text-muted-foreground underline">Modifier livraison</button>
                </div>
                
                <div className="border border-secondary bg-secondary/5 p-6 mb-8">
                  <h3 className="font-medium text-lg mb-2">{t('checkout.paymentMethod')}</h3>
                  <p className="text-muted-foreground">{t('checkout.paymentInfo')}</p>
                </div>
                
                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-muted-foreground hover:text-foreground">Retour</button>
                  <Button onClick={handleConfirmOrder} size="lg" className="w-full sm:w-auto">
                    {t('checkout.confirm')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-muted/20 p-6 md:p-8 border border-border sticky top-24">
              <h2 className="text-xl font-serif mb-6">Votre Commande</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-background border border-border" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Qté: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-sm">
                      {(item.price * item.quantity).toFixed(2)} د.ت
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">{total.toFixed(2)} د.ت</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">{deliveryFee === 0 ? 'Offerte' : `${deliveryFee.toFixed(2)} د.ت`}</span>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-serif">Total</span>
                  <span className="text-2xl font-serif font-medium">{finalTotal.toFixed(2)} د.ت</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
