import * as React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SEED_PRODUCTS, SEED_CATEGORIES } from "@/lib/firestore";
import { AnimatePresence, motion } from "framer-motion";

export default function ShopPage() {
  const { t } = useTranslation();
  const [searchParams] = React.useState(new URLSearchParams(window.location.search));
  
  const [activeCategory, setActiveCategory] = React.useState<string | null>(searchParams.get('category'));
  const [activeFlavors, setActiveFlavors] = React.useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("default");

  // Get all unique flavors
  const allFlavors = React.useMemo(() => {
    const flavors = new Set<string>();
    SEED_PRODUCTS.forEach(p => p.flavors?.forEach(f => flavors.add(f)));
    return Array.from(flavors);
  }, []);

  const toggleFlavor = (flavor: string) => {
    setActiveFlavors(prev => 
      prev.includes(flavor) ? prev.filter(f => f !== flavor) : [...prev, flavor]
    );
  };

  const filteredProducts = React.useMemo(() => {
    let result = [...SEED_PRODUCTS];
    
    if (activeCategory) {
      const categoryName = SEED_CATEGORIES.find(c => c.slug === activeCategory)?.name;
      if (categoryName) {
        result = result.filter(p => p.categories.includes(categoryName));
      }
    }
    
    if (activeFlavors.length > 0) {
      result = result.filter(p => p.flavors?.some(f => activeFlavors.includes(f)));
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    } else if (sortBy === "bestsellers") {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [activeCategory, activeFlavors, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-10">
      <div>
        <h3 className="font-serif text-xl mb-4">{t('home.categories')}</h3>
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => setActiveCategory(null)}
              className={`text-sm hover:text-secondary transition-colors ${!activeCategory ? 'text-secondary font-medium' : 'text-muted-foreground'}`}
            >
              Tous les produits
            </button>
          </li>
          {SEED_CATEGORIES.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => setActiveCategory(cat.slug)}
                className={`text-sm hover:text-secondary transition-colors ${activeCategory === cat.slug ? 'text-secondary font-medium' : 'text-muted-foreground'}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-serif text-xl mb-4">{t('shop.flavors')}</h3>
        <div className="space-y-3">
          {allFlavors.map(flavor => (
            <label key={flavor} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 border border-border flex items-center justify-center transition-colors ${activeFlavors.includes(flavor) ? 'bg-secondary border-secondary' : 'group-hover:border-secondary'}`}>
                {activeFlavors.includes(flavor) && <div className="w-2 h-2 bg-secondary-foreground" />}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{flavor}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-muted/30 py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{t('shop.title')}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground uppercase tracking-widest font-sans">
            <Link href="/" className="hover:text-foreground">Accueil</Link>
            <span>/</span>
            <span className="text-foreground">Boutique</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filter Toggle & Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-border">
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium uppercase tracking-widest w-full sm:w-auto justify-center border border-border py-3 px-6"
              >
                <Filter size={16} /> {t('shop.filters')}
              </button>

              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} produits trouvés
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">{t('shop.sort')}:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-border py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-secondary w-full sm:w-auto"
                >
                  <option value="default">Par défaut</option>
                  <option value="bestsellers">Meilleures ventes</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="text-2xl font-serif mb-4">{t('shop.empty')}</h3>
                <Button onClick={() => { setActiveCategory(null); setActiveFlavors([]); }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product, idx) => (
                  <SectionReveal key={product.id} delay={Math.min(idx * 0.05, 0.5)}>
                    <ProductCard product={product} />
                  </SectionReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-full max-w-[300px] bg-background shadow-2xl z-[70] flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-serif flex items-center gap-2">
                  <SlidersHorizontal size={20} />
                  {t('shop.filters')}
                </h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <FilterSidebar />
              </div>
              <div className="p-6 border-t border-border bg-muted/20">
                <Button onClick={() => setIsMobileFiltersOpen(false)} className="w-full">
                  Voir les résultats
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </Layout>
  );
}
