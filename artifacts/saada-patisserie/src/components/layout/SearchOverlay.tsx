import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { SEED_PRODUCTS } from "@/lib/firestore";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState("");
  const [, setLocation] = useLocation();

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEED_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.shortDescription.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const handleResultClick = (slug: string) => {
    onClose();
    setLocation(`/boutique/${slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-background"
        >
          <div className="container mx-auto px-4 md:px-8 pt-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex-1 flex items-center gap-4">
                <Search className="text-muted-foreground" size={24} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('common.search')}
                  className="w-full bg-transparent text-2xl font-serif focus:outline-none placeholder:text-muted-foreground/50"
                />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full ml-4">
                <X size={28} />
              </button>
            </div>

            <div className="mt-8 max-w-3xl mx-auto">
              {query && results.length === 0 && (
                <p className="text-center text-muted-foreground text-lg py-12">
                  Aucun résultat pour "{query}"
                </p>
              )}
              {results.length > 0 && (
                <div className="space-y-6">
                  {results.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => handleResultClick(product.slug)}
                      className="flex items-center gap-6 group cursor-pointer p-4 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover" />
                      <div>
                        <h3 className="font-serif text-xl group-hover:text-secondary transition-colors">{product.name}</h3>
                        <p className="text-muted-foreground line-clamp-1">{product.shortDescription}</p>
                        <p className="text-foreground font-medium mt-1">{product.price} €</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
