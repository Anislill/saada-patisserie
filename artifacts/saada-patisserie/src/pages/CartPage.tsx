import * as React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal();
  const delivery = total > 100 ? 0 : 9.90;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex-1 container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <ShoppingBag size={64} className="text-muted-foreground/50 mb-6" strokeWidth={1} />
          <h1 className="text-4xl font-serif mb-4">{t('cart.title')}</h1>
          <p className="text-muted-foreground mb-8 text-lg">{t('cart.empty')}</p>
          <Link href="/boutique">
            <Button size="lg">{t('cart.continueShopping')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{t('cart.title')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-sans uppercase tracking-widest text-muted-foreground mb-6">
              <div className="col-span-6">Produit</div>
              <div className="col-span-2 text-center">Prix</div>
              <div className="col-span-2 text-center">Quantité</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-8 md:space-y-6">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-border pb-6 md:pb-6 last:border-0">
                  {/* Mobile Layout */}
                  <div className="col-span-12 flex gap-4 md:hidden">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover bg-muted" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                        {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                        <p className="font-medium mt-1">{item.price} د.ت</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-muted"><Minus size={14}/></button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-muted"><Plus size={14}/></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-2 text-muted-foreground hover:text-destructive">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="col-span-6 hidden md:flex items-center gap-6">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover bg-muted" />
                    <div>
                      <Link href={`/boutique/${item.productId}`} className="font-serif text-lg hover:text-secondary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      {item.variant && <p className="text-sm text-muted-foreground mt-1">{item.variant}</p>}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors mt-2 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-2 hidden md:block text-center font-medium">
                    {item.price} د.ت
                  </div>
                  
                  <div className="col-span-2 hidden md:flex justify-center">
                    <div className="flex items-center border border-border">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-muted"><Minus size={14}/></button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-muted"><Plus size={14}/></button>
                    </div>
                  </div>
                  
                  <div className="col-span-2 hidden md:block text-right font-serif text-lg">
                    {(item.price * item.quantity).toFixed(2)} د.ت
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-muted/20 p-8 border border-border">
              <h2 className="text-2xl font-serif mb-6">Récapitulatif</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="font-medium">{total.toFixed(2)} د.ت</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">{delivery === 0 ? 'Offerte' : `${delivery.toFixed(2)} د.ت`}</span>
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-serif">Total</span>
                  <span className="text-2xl font-serif font-medium">{(total + delivery).toFixed(2)} د.ت</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">Taxes incluses</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Code promo</p>
                <div className="flex gap-2">
                  <Input placeholder="Votre code" className="bg-background" />
                  <Button variant="outline">Appliquer</Button>
                </div>
              </div>

              <Button onClick={() => setLocation("/commande")} size="lg" className="w-full">
                {t('cart.checkout')}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-4 opacity-50">
                <div className="h-8 w-12 bg-foreground/10 rounded"></div>
                <div className="h-8 w-12 bg-foreground/10 rounded"></div>
                <div className="h-8 w-12 bg-foreground/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
