import * as React from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Product } from "@/lib/firestore";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);

  React.useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
  }, [product]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!product) return null;

  const price = product.discountedPrice || product.price;
  const discountPct = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price,
      quantity,
      image: product.images[0],
    });
    toast({
      title: "Ajouté au panier",
      description: `${quantity}× ${product.name} ajouté à votre panier.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 z-[90] -translate-y-1/2 mx-auto max-w-3xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-background/90 border border-border hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Images */}
              <div className="relative bg-muted">
                <div className="aspect-square overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      src={product.images[activeImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 p-3">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-14 h-14 rounded overflow-hidden border-2 transition-colors ${
                          i === activeImage ? "border-secondary" : "border-transparent"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col p-6 md:p-8">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.isBestSeller && (
                    <Badge variant="secondary">Meilleure Vente</Badge>
                  )}
                  {discountPct && (
                    <Badge variant="destructive">-{discountPct}%</Badge>
                  )}
                </div>

                {/* Name */}
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-serif text-2xl text-foreground font-medium">
                    {price} <span className="text-base">د.ت</span>
                  </span>
                  {product.discountedPrice && (
                    <span className="text-muted-foreground line-through text-sm">
                      {product.price} د.ت
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border mb-5" />

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Flavors / Ingredients */}
                {product.flavors && product.flavors.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      Arômes &amp; Saveurs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.flavors.map((f) => (
                        <span
                          key={f}
                          className="text-xs border border-border rounded-full px-3 py-1 text-foreground"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Quantité
                  </p>
                  <div className="flex items-center border border-border rounded w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-sm uppercase tracking-widest"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Ajouter au panier
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
