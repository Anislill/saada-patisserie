import * as React from "react";
import { Link } from "wouter";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import { SEED_PRODUCTS } from "@/lib/firestore";

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const wishlistedProducts = SEED_PRODUCTS.filter(p => productIds.includes(p.id));

  return (
    <AccountLayout activeTab="favoris">
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-serif mb-8">Mes Favoris</h2>
        
        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border border-border">
            <p className="text-muted-foreground mb-4">Votre liste de favoris est vide.</p>
            <Link href="/boutique"><Button>Explorer la boutique</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
