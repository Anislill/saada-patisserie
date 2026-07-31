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
    e.preventDefault();
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
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="group block w-full cursor-default">
        {/* Image area */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isBestSeller && (
              <Badge variant="secondary" className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground">
                Meilleure Vente
              </Badge>
            )}
            {product.discountedPrice && (
              <Badge variant="destructive" className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground">
                -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Top-right actions: wishlist + quick view */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <button
              onClick={handleToggleWishlist}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              aria-label="Ajouter aux favoris"
            >
              <Heart
                size={15}
                className={`transition-colors ${isWishlisted ? "fill-secondary text-secondary" : "text-foreground"}`}
              />
            </button>
            <button
              onClick={handleQuickView}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Aperçu rapide"
            >
              <Eye size={15} className="text-foreground" />
            </button>
          </div>

          {/* Image */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Quick View hover label — bottom overlay */}
          <button
            onClick={handleQuickView}
            className="absolute inset-x-0 bottom-0 py-3 px-4 flex items-center justify-center gap-2 bg-background/90 backdrop-blur-sm text-foreground text-xs uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 hover:bg-secondary hover:text-secondary-foreground"
          >
            <Eye size={14} />
            Aperçu rapide
          </button>
        </div>

        {/* Info */}
        <div className="text-center px-2 mb-3">
          <h3 className="font-serif text-base md:text-lg text-foreground mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.shortDescription}</p>
          <div className="flex items-center justify-center gap-2">
            {product.discountedPrice ? (
              <>
                <span className="text-muted-foreground line-through text-sm">{product.price} د.ت</span>
                <span className="text-foreground font-medium">{product.discountedPrice} د.ت</span>
              </>
            ) : (
              <span className="text-foreground font-medium">{product.price} د.ت</span>
            )}
          </div>
        </div>

        {/* Add to Cart — always visible */}
        <Button
          onClick={handleAddToCart}
          variant="outline"
          className="w-full border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-xs uppercase tracking-widest h-10"
        >
          <ShoppingBag size={15} className="mr-2 flex-shrink-0" />
          Ajouter au panier
        </Button>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
