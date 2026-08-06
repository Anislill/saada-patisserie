import * as React from "react";
import { Eye, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Product, getPriceUnitLabel, getQtyDisplay } from "@/lib/firestore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { QuickViewModal } from "@/components/QuickViewModal";

const spring = { type: "spring", stiffness: 420, damping: 18 } as const;

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const { toast } = useToast();
  const isWishlisted = hasItem(product.id);
  const [qty, setQty] = React.useState(1);
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountedPrice || product.price,
      quantity: qty,
      image: product.images[0],
    });
    toast({
      title: "Ajouté au panier",
      description: `${qty}× ${product.name} ajouté à votre panier.`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <>
      <div className="flex flex-col w-full group">

        {/* ── Image ─────────────────────────────── */}
        <div className="relative overflow-hidden bg-muted mb-3 rounded-sm">
          <div className="aspect-[4/5]">
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Badges — top left */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.isBestSeller && (
              <Badge
                variant="secondary"
                className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-[10px] px-2 py-0.5"
              >
                Meilleure Vente
              </Badge>
            )}
            {product.discountedPrice && (
              <Badge
                variant="destructive"
                className="bg-destructive/90 backdrop-blur-sm text-[10px] px-2 py-0.5"
              >
                -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Wishlist — top right */}
          <motion.button
            onClick={handleToggleWishlist}
            aria-label="Ajouter aux favoris"
            className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/85 backdrop-blur-sm shadow-sm"
            whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.95)" }}
            whileTap={{ scale: 0.8 }}
            transition={spring}
          >
            <motion.div
              animate={isWishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={14}
                className={`transition-colors duration-200 ${
                  isWishlisted ? "fill-secondary text-secondary" : "text-foreground"
                }`}
              />
            </motion.div>
          </motion.button>

          {/* Quick View — bottom right */}
          <motion.button
            onClick={() => setIsQuickViewOpen(true)}
            aria-label="Aperçu rapide"
            title="Aperçu rapide"
            className="absolute bottom-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/85 backdrop-blur-sm shadow-sm"
            whileHover={{ scale: 1.15, backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            whileTap={{ scale: 0.85 }}
            transition={spring}
          >
            <Eye size={14} />
          </motion.button>
        </div>

        {/* ── Info ──────────────────────────────── */}
        <div className="text-center px-1 mb-3">
          <h3 className="font-serif text-sm md:text-base text-foreground mb-0.5 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] md:text-xs text-muted-foreground mb-2 line-clamp-1">
            {product.shortDescription}
          </p>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-2 mb-3 flex-wrap">
            {product.discountedPrice ? (
              <>
                <span className="text-muted-foreground line-through text-xs">
                  {product.price} د.ت
                </span>
                <span className="text-secondary font-bold text-base">
                  {product.discountedPrice} د.ت
                  {getPriceUnitLabel(product.pricingUnit) && (
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      {getPriceUnitLabel(product.pricingUnit)}
                    </span>
                  )}
                </span>
              </>
            ) : (
              <span className="text-secondary font-bold text-base">
                {product.price} د.ت
                {getPriceUnitLabel(product.pricingUnit) && (
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    {getPriceUnitLabel(product.pricingUnit)}
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Prep time badge */}
          {product.prepTime && (
            <div className="flex items-center justify-center mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground border border-border/60 rounded-full px-2 py-0.5">
                ⏱ min {product.prepTime.value}{product.prepTime.unit === "hours" ? "h" : "j"}
              </span>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center border border-border rounded-sm overflow-hidden">
              <motion.button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-base font-medium"
                whileTap={{ scale: 0.75 }}
                transition={spring}
              >
                <Minus size={13} />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.span
                  key={qty}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-[36px] px-1 text-center text-sm font-medium select-none border-x border-border h-8 flex items-center justify-center"
                >
                  {getQtyDisplay(qty, product.pricingUnit)}
                </motion.span>
              </AnimatePresence>

              <motion.button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                whileTap={{ scale: 0.75 }}
                transition={spring}
              >
                <Plus size={13} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Add to Cart */}
        <motion.button
          onClick={handleAddToCart}
          className={`w-full h-9 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-light rounded-full overflow-hidden relative ${
            added
              ? "bg-primary/80 text-primary-foreground"
              : "bg-primary text-primary-foreground"
          }`}
          whileHover={!added ? { y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.18)" } : {}}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
        >
          {/* shimmer sweep on hover */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full pointer-events-none"
            whileHover={{ translateX: "200%" }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />

          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                >
                  ✓
                </motion.span>
                Ajouté
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={14} className="flex-shrink-0" />
                Ajouter au panier
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
