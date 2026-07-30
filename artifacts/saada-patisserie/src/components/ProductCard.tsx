import * as React from "react";
import { Link } from "wouter";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/firestore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const { toast } = useToast();
  const isWishlisted = hasItem(product.id);

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

  return (
    <Link href={`/boutique/${product.slug}`} className="group block w-full">
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

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart 
            size={16} 
            className={`transition-colors ${isWishlisted ? 'fill-secondary text-secondary' : 'text-foreground'}`} 
          />
        </button>

        {/* Image */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-background/95 backdrop-blur-sm text-foreground hover:bg-secondary hover:text-secondary-foreground"
          >
            <ShoppingBag size={18} className="mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="text-center px-2">
        <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-secondary transition-colors line-clamp-1">
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
    </Link>
  );
}
