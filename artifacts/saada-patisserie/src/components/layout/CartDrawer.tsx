import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const handleCheckout = () => {
    onClose();
    setLocation("/commande");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-serif text-foreground flex items-center gap-2">
                <ShoppingBag size={20} />
                {t('cart.title')}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={48} className="text-muted-foreground" strokeWidth={1} />
                  <p className="text-muted-foreground">{t('cart.empty')}</p>
                  <Button onClick={() => { onClose(); setLocation("/boutique"); }} variant="outline">
                    {t('cart.continueShopping')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 bg-muted flex-shrink-0 relative overflow-hidden">
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-foreground line-clamp-1">{item.name}</h3>
                          {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                          <p className="text-secondary font-medium mt-1">{item.price} د.ت</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 hover:bg-muted"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-muted"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-muted-foreground underline hover:text-destructive transition-colors"
                          >
                            {t('common.delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 bg-muted/20">
                <div className="flex justify-between items-center mb-6 text-lg font-serif">
                  <span>{t('cart.subtotal')}</span>
                  <span>{getTotal()} د.ت</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6 text-center">
                  {t('cart.deliveryEstimate')}
                </p>
                <Button onClick={handleCheckout} className="w-full">
                  {t('cart.checkout')}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
