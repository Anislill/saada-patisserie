import * as React from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import { useProductStore } from "@/store/productStore";

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const products = useProductStore((s) => s.products);
  const wishlistedProducts = products.filter(p => productIds.includes(p.id));

  return (
    <AccountLayout activeTab="favoris">
      <div className="animate-in fade-in duration-500">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-foreground">Mes Favoris</h2>
          {wishlistedProducts.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {wishlistedProducts.length} produit{wishlistedProducts.length > 1 ? "s" : ""} sauvegardé{wishlistedProducts.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg bg-muted/10">
            <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Heart size={24} className="text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-1">Votre liste de favoris est vide</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Ajoutez des produits à vos favoris pour les retrouver facilement.
            </p>
            <Link href="/boutique">
              <Button size="sm">Explorer la boutique</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
