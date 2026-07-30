import * as React from "react";
import { Link, useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { Heart, Truck, ShieldCheck, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEED_PRODUCTS } from "@/lib/firestore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const [, params] = useRoute("/boutique/:slug");
  const slug = params?.slug;
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const { toast } = useToast();

  const product = SEED_PRODUCTS.find(p => p.slug === slug);
  
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedFlavor, setSelectedFlavor] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState("desc");

  React.useEffect(() => {
    if (product?.variants) {
      if (product.variants.size && product.variants.size.length > 0) {
        setSelectedSize(product.variants.size[0]);
      }
      if (product.variants.flavor && product.variants.flavor.length > 0) {
        setSelectedFlavor(product.variants.flavor[0]);
      }
    }
    setQuantity(1);
    setActiveImage(0);
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h1 className="text-3xl font-serif mb-4">Produit introuvable</h1>
          <Link href="/boutique"><Button>Retour à la boutique</Button></Link>
        </div>
      </Layout>
    );
  }

  const isWishlisted = hasItem(product.id);
  const relatedProducts = SEED_PRODUCTS.filter(p => 
    p.id !== product.id && p.categories.some(c => product.categories.includes(c))
  ).slice(0, 4);

  const handleAddToCart = () => {
    let variantStr = "";
    if (selectedSize) variantStr += selectedSize;
    if (selectedFlavor) variantStr += (variantStr ? " - " : "") + selectedFlavor;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountedPrice || product.price,
      quantity,
      image: product.images[0],
      variant: variantStr || undefined
    });

    toast({
      title: "Ajouté au panier",
      description: `${quantity}x ${product.name} ajouté à votre panier.`
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-sans">
          <Link href="/" className="hover:text-foreground">Accueil</Link>
          <span>/</span>
          <Link href="/boutique" className="hover:text-foreground">Boutique</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto w-full md:w-24 shrink-0 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square w-24 shrink-0 overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-secondary' : 'border-transparent'}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {/* Fallback to show multiple thumbs if only 1 image exists for demo purposes */}
              {product.images.length === 1 && [1,2].map((_, idx) => (
                <button 
                  key={idx+1} 
                  onClick={() => setActiveImage(0)}
                  className={`relative aspect-square w-24 shrink-0 overflow-hidden border-2 border-transparent opacity-50`}
                >
                  <img src={product.images[0]} alt="thumbnail" className="w-full h-full object-cover grayscale" />
                </button>
              ))}
            </div>
            
            <div className="relative aspect-[4/5] w-full order-1 md:order-2 bg-muted overflow-hidden group">
              {product.isBestSeller && (
                <Badge variant="secondary" className="absolute top-4 left-4 z-10">Meilleure Vente</Badge>
              )}
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={product.images[activeImage] || product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              {product.discountedPrice ? (
                <>
                  <span className="text-2xl font-medium text-foreground">{product.discountedPrice} د.ت</span>
                  <span className="text-xl text-muted-foreground line-through">{product.price} د.ت</span>
                  <Badge variant="destructive">-{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%</Badge>
                </>
              ) : (
                <span className="text-2xl font-medium text-foreground">{product.price} د.ت</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && (
              <div className="space-y-6 mb-8">
                {product.variants.size && (
                  <div>
                    <span className="block text-sm uppercase tracking-widest font-medium mb-3">Taille</span>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.size.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-2 border transition-colors ${selectedSize === size ? 'border-secondary bg-secondary/10 text-foreground' : 'border-border text-muted-foreground hover:border-foreground'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.variants.flavor && (
                  <div>
                    <span className="block text-sm uppercase tracking-widest font-medium mb-3">Saveur</span>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.flavor.map(flavor => (
                        <button
                          key={flavor}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`px-6 py-2 border transition-colors ${selectedFlavor === flavor ? 'border-secondary bg-secondary/10 text-foreground' : 'border-border text-muted-foreground hover:border-foreground'}`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-border h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full hover:bg-muted transition-colors"><Minus size={16} /></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full hover:bg-muted transition-colors"><Plus size={16} /></button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1 h-14 text-base">
                {t('product.addToCart')}
              </Button>
              <button 
                onClick={() => toggleItem(product.id)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${isWishlisted ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border text-foreground hover:border-foreground'}`}
              >
                <Heart size={20} className={isWishlisted ? 'fill-secondary' : ''} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border mb-8">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-secondary" />
                <span className="text-sm font-medium">Livraison Rapide</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-secondary" />
                <span className="text-sm font-medium">Paiement Sécurisé</span>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-8 border-b border-border mb-6">
                <button 
                  onClick={() => setActiveTab("desc")}
                  className={`pb-2 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 ${activeTab === "desc" ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground'}`}
                >
                  Description
                </button>
                <button 
                  onClick={() => setActiveTab("ing")}
                  className={`pb-2 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 ${activeTab === "ing" ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground'}`}
                >
                  Ingrédients
                </button>
              </div>
              <div className="text-muted-foreground text-sm leading-relaxed">
                {activeTab === "desc" && (
                  <p>{product.description}</p>
                )}
                {activeTab === "ing" && (
                  <p>Farine de blé, beurre AOP, sucre, amandes, pistaches d'Iran torréfiées, miel, eau de fleur d'oranger. <br/><br/><strong>Allergènes:</strong> Gluten, fruits à coque, produits laitiers.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-serif text-center mb-12">Vous aimerez aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p, idx) => (
                <SectionReveal key={p.id} delay={idx * 0.1}>
                  <ProductCard product={p} />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

    </Layout>
  );
}
