import * as React from "react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/firestore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { QuickViewModal } from "@/components/QuickViewModal";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const { toast } = useToast();
  const isWishlisted = hasItem(product.id);
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountedPrice || product.price,
      quantity: 1,
      image: product.images[0],
    });
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <>
      <div className="group flex flex-col w-full">
        {/* ── Image ────────────────────────────────── */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-3">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isBestSeller && (
              <Badge
                variant="secondary"
                className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-[10px]"
              >
                Meilleure Vente
              </Badge>
            )}
            {product.discountedPrice && (
              <Badge
                variant="destructive"
                className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground text-[10px]"
              >
                -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Wishlist — always visible */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/85 backdrop-blur-sm hover:bg-background transition-colors shadow-sm"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              size={15}
              className={isWishlisted ? "fill-secondary text-secondary" : "text-foreground"}
            />
          </button>

          {/* Product image */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── Info ─────────────────────────────────── */}
        <div className="text-center px-1 mb-3 flex-1">
          <h3 className="font-serif text-base md:text-lg text-foreground mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-center gap-2">
            {product.discountedPrice ? (
              <>
                <span className="text-muted-foreground line-through text-xs">
                  {product.price} د.ت
                </span>
                <span className="text-foreground font-semibold text-sm">
                  {product.discountedPrice} د.ت
                </span>
              </>
            ) : (
              <span className="text-foreground font-semibold text-sm">
                {product.price} د.ت
              </span>
            )}
          </div>
        </div>

        {/* ── Actions ──────────────────────────────── */}
        <div className="flex gap-2">
          {/* Add to Cart — always visible, full-width */}
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-xs uppercase tracking-widest h-10"
          >
            <ShoppingBag size={14} className="mr-1.5 flex-shrink-0" />
            Ajouter
          </Button>

          {/* Quick View — always visible eye icon */}
          <button
            onClick={() => setIsQuickViewOpen(true)}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-border rounded bg-background hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors"
            aria-label="Aperçu rapide"
            title="Aperçu rapide"
          >
            <Eye size={16} />
          </button>
        </div>
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
