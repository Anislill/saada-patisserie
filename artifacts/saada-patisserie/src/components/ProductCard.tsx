import * as React from "react";
import { Eye, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/firestore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { QuickViewModal } from "@/components/QuickViewModal";

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
      <div className="flex flex-col w-full">
        {/* ── Image ─────────────────────────────── */}
        <div className="relative overflow-hidden bg-muted mb-3 rounded-sm">
          {/* aspect ratio wrapper */}
          <div className="aspect-[4/5]">
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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

          {/* Wishlist — top right, always visible */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/85 backdrop-blur-sm hover:bg-background transition-colors shadow-sm"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              size={14}
              className={isWishlisted ? "fill-secondary text-secondary" : "text-foreground"}
            />
          </button>

          {/* Quick View — bottom right of image, always visible */}
          <button
            onClick={() => setIsQuickViewOpen(true)}
            className="absolute bottom-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/85 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
            aria-label="Aperçu rapide"
            title="Aperçu rapide"
          >
            <Eye size={14} />
          </button>
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
          <div className="flex items-baseline justify-center gap-2 mb-3">
            {product.discountedPrice ? (
              <>
                <span className="text-muted-foreground line-through text-xs">
                  {product.price} د.ت
                </span>
                <span className="text-secondary font-bold text-base">
                  {product.discountedPrice} د.ت
                </span>
              </>
            ) : (
              <span className="text-secondary font-bold text-base">
                {product.price} د.ت
              </span>
            )}
          </div>

          {/* Quantity selector — Fostka style */}
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center border border-border rounded-sm overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-base font-medium"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center text-sm font-medium select-none border-x border-border h-8 flex items-center justify-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Add to Cart — full width, Fostka style */}
        <button
          onClick={handleAddToCart}
          className={`w-full h-10 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-medium transition-all duration-300 rounded-sm ${
            added
              ? "bg-primary/80 text-primary-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
          }`}
        >
          <ShoppingBag size={14} className="flex-shrink-0" />
          {added ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
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
