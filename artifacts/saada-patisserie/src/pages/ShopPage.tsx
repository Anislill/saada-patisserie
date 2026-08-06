import * as React from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SEED_CATEGORIES } from "@/lib/firestore";
import { useProductStore } from "@/store/productStore";
import { AnimatePresence, motion } from "framer-motion";

/* ─────────────── sub-components ─────────────── */

/** Searchable checkbox list (flavors or categories) */
function SearchableList({
  title,
  placeholder,
  items,
  counts,
  selected,
  onToggle,
}: {
  title: string;
  placeholder: string;
  items: { label: string; value: string }[];
  counts: Record<string, number>;
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-4 text-foreground">
        {title}
      </h3>

      {/* search input */}
      <div className="flex items-center border border-border px-3 py-2 mb-3 gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <Search size={14} className="text-muted-foreground shrink-0" />
      </div>

      {/* scrollable list */}
      <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
        {filtered.map(item => {
          const count = counts[item.value] ?? 0;
          const active = selected.includes(item.value);
          return (
            <button
              key={item.value}
              onClick={() => onToggle(item.value)}
              className={`w-full flex items-center justify-between py-1.5 px-1 text-sm transition-colors rounded-sm
                ${active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span>{item.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border
                  ${active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Price range slider */
function PriceRangeFilter({
  range,
  min,
  max,
  onApply,
}: {
  range: [number, number];
  min: number;
  max: number;
  onApply: (r: [number, number]) => void;
}) {
  const [local, setLocal] = React.useState<[number, number]>(range);

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-5 text-foreground">
        Filtrer par prix
      </h3>

      {/* Radix slider */}
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5 mb-4"
        min={min}
        max={max}
        step={5}
        value={local}
        onValueChange={v => setLocal(v as [number, number])}
      >
        <SliderPrimitive.Track className="relative bg-border grow rounded-full h-[3px]">
          <SliderPrimitive.Range className="absolute bg-primary rounded-full h-full" />
        </SliderPrimitive.Track>
        {local.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="block w-4 h-4 bg-primary rounded-full border-2 border-background shadow
                       focus:outline-none focus:ring-2 focus:ring-primary cursor-grab active:cursor-grabbing"
          />
        ))}
      </SliderPrimitive.Root>

      {/* price display + apply button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          Prix&nbsp;: <strong className="text-foreground">{local[0]} د.ت</strong>
          &nbsp;—&nbsp;
          <strong className="text-foreground">{local[1]} د.ت</strong>
        </span>
        <button
          onClick={() => onApply(local)}
          className="text-xs uppercase tracking-[0.18em] font-normal border border-foreground px-4 py-1.5
                     rounded-full hover:bg-foreground hover:text-background transition-all duration-200 hover:-translate-y-0.5"
        >
          Filtrer
        </button>
      </div>
    </div>
  );
}

/* ─────────────── main page ─────────────── */
export default function ShopPage() {
  const { t } = useTranslation();
  const [searchParams] = React.useState(new URLSearchParams(window.location.search));

  const allStoreProducts = useProductStore((s) => s.products);

  const [priceMin, priceMax] = React.useMemo(() => {
    const prices = allStoreProducts.map(p => p.discountedPrice ?? p.price);
    if (!prices.length) return [0, 1000];
    return [Math.min(...prices), Math.max(...prices)];
  }, [allStoreProducts]);

  const [activeCategories, setActiveCategories] = React.useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [activeFlavors, setActiveFlavors] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000]);

  // Sync price range when products first load from Firestore
  const priceInitialized = React.useRef(false);
  React.useEffect(() => {
    if (!priceInitialized.current && allStoreProducts.length > 0) {
      priceInitialized.current = true;
      setPriceRange([priceMin, priceMax]);
    }
  }, [allStoreProducts.length, priceMin, priceMax]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("default");

  const storeProducts = React.useMemo(
    () => allStoreProducts.filter((p) => p.isAvailable),
    [allStoreProducts]
  );
  const flavorMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    allStoreProducts.forEach(p => p.flavors?.forEach(f => { map[f] = (map[f] ?? 0) + 1; }));
    return map;
  }, [allStoreProducts]);
  const categoryMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    SEED_CATEGORIES.forEach(cat => {
      map[cat.slug] = allStoreProducts.filter(p => Array.isArray(p.categories) && p.categories.includes(cat.name)).length;
    });
    return map;
  }, [allStoreProducts]);

  const allFlavors = React.useMemo(
    () => Object.keys(flavorMap).sort().map(f => ({ label: f, value: f })),
    [flavorMap]
  );
  const allCategories = React.useMemo(
    () => SEED_CATEGORIES.map(c => ({ label: c.name, value: c.slug })),
    []
  );

  const toggleFlavor = (f: string) =>
    setActiveFlavors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const toggleCategory = (slug: string) =>
    setActiveCategories(prev => prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug]);

  const resetAll = () => {
    setActiveCategories([]);
    setActiveFlavors([]);
    setPriceRange([priceMin, priceMax]);
  };

  const activeCount = activeCategories.length + activeFlavors.length +
    (priceRange[0] !== priceMin || priceRange[1] !== priceMax ? 1 : 0);

  const filteredProducts = React.useMemo(() => {
    let result = [...storeProducts];

    if (activeCategories.length > 0) {
      result = result.filter(p =>
        activeCategories.some(slug => {
          const name = SEED_CATEGORIES.find(c => c.slug === slug)?.name;
          return name && Array.isArray(p.categories) && p.categories.includes(name);
        })
      );
    }

    if (activeFlavors.length > 0) {
      result = result.filter(p => p.flavors?.some(f => activeFlavors.includes(f)));
    }

    result = result.filter(p => {
      const effective = p.discountedPrice ?? p.price;
      return effective >= priceRange[0] && effective <= priceRange[1];
    });

    if (sortBy === "price-asc")
      result.sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
    else if (sortBy === "price-desc")
      result.sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
    else if (sortBy === "bestsellers")
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));

    return result;
  }, [activeCategories, activeFlavors, priceRange, sortBy]);

  /* shared sidebar content */
  const FilterSidebar = () => (
    <div className="space-y-8">
      <PriceRangeFilter range={priceRange} min={priceMin} max={priceMax} onApply={setPriceRange} />

      <div className="border-t border-border" />

      <SearchableList
        title="Filtrer par saveur"
        placeholder="trouver Saveur"
        items={allFlavors}
        counts={flavorMap}
        selected={activeFlavors}
        onToggle={toggleFlavor}
      />

      <div className="border-t border-border" />

      <SearchableList
        title="Filtrer par type de pâtisserie"
        placeholder="trouver Type de pâtisserie"
        items={allCategories}
        counts={categoryMap}
        selected={activeCategories}
        onToggle={toggleCategory}
      />

      {activeCount > 0 && (
        <>
          <div className="border-t border-border" />
          <button
            onClick={resetAll}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </>
      )}
    </div>
  );

  return (
    <Layout>
      {/* page header */}
      <div className="bg-muted/30 py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{t("shop.title")}</h1>
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

          {/* Main content */}
          <div className="flex-1">
            {/* toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-border">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium uppercase tracking-widest w-full sm:w-auto justify-center border border-border py-3 px-6"
              >
                <Filter size={16} />
                {t("shop.filters")}
                {activeCount > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé{filteredProducts.length !== 1 ? "s" : ""}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">{t("shop.sort")} :</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent border border-border py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-secondary w-full sm:w-auto"
                >
                  <option value="default">Par défaut</option>
                  <option value="bestsellers">Meilleures ventes</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* product grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="text-2xl font-serif mb-4">{t("shop.empty")}</h3>
                <Button onClick={resetAll}>Réinitialiser les filtres</Button>
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
              className="fixed top-0 left-0 h-full w-full max-w-[320px] bg-background shadow-2xl z-[70] flex flex-col lg:hidden"
            >
              {/* drawer header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-base font-bold uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filtres
                  {activeCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {activeCount}
                    </span>
                  )}
                </h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2">
                  <X size={20} />
                </button>
              </div>

              {/* drawer body */}
              <div className="flex-1 overflow-y-auto p-6">
                <FilterSidebar />
              </div>

              {/* drawer footer */}
              <div className="p-5 border-t border-border bg-muted/20 flex flex-col gap-3">
                {activeCount > 0 && (
                  <button
                    onClick={resetAll}
                    className="w-full text-sm uppercase tracking-widest border border-border py-2.5 px-4 hover:bg-muted transition-colors"
                  >
                    Effacer les filtres ({activeCount})
                  </button>
                )}
                <Button onClick={() => setIsMobileFiltersOpen(false)} className="w-full">
                  Voir {filteredProducts.length} résultat{filteredProducts.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
