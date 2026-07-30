import * as React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import logoPath from "@assets/0_file_00000000873481f494288e53319f68ef-removebg-preview_1785313194757.png";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [showAnnouncement, setShowAnnouncement] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/boutique", label: t('nav.shop') },
    { href: "/a-propos", label: t('nav.about') },
    { href: "/contact", label: t('nav.contact') },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-primary-foreground py-2 px-4 text-xs md:text-sm text-center relative overflow-hidden"
          >
            <div className="whitespace-nowrap overflow-hidden">
              <span className="inline-block animate-[marquee_15s_linear_infinite]">
                Livraison gratuite à partir de 100€ d'achats • Découvrez notre nouvelle collection printemps
              </span>
            </div>
            <button 
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-2" 
            : "bg-background/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center justify-center">
            <img src={logoPath} alt="Saada Pâtisserie" className="h-10 md:h-14 object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm uppercase tracking-widest hover:text-secondary transition-colors ${
                  location === link.href ? "text-secondary font-medium" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-2 mr-2 text-xs font-serif uppercase tracking-widest text-muted-foreground">
              <button onClick={() => changeLanguage('fr')} className={`hover:text-foreground ${i18n.language === 'fr' ? 'text-foreground' : ''}`}>FR</button>
              <span>|</span>
              <button onClick={() => changeLanguage('ar')} className={`hover:text-foreground ${i18n.language === 'ar' ? 'text-foreground' : ''}`}>AR</button>
              <span>|</span>
              <button onClick={() => changeLanguage('en')} className={`hover:text-foreground ${i18n.language === 'en' ? 'text-foreground' : ''}`}>EN</button>
            </div>

            <button onClick={() => setIsSearchOpen(true)} className="text-foreground hover:text-secondary transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <Link href="/compte/favoris" className="text-foreground hover:text-secondary transition-colors relative hidden md:block">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/compte" className="text-foreground hover:text-secondary transition-colors hidden md:block">
              <User size={20} strokeWidth={1.5} />
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-foreground hover:text-secondary transition-colors relative"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <img src={logoPath} alt="Saada" className="h-8 object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="my-4 border-t border-border" />
              
              <Link href="/compte" onClick={() => setIsMobileMenuOpen(false)} className="text-lg flex items-center gap-3">
                <User size={20} /> {t('nav.account')}
              </Link>
              <Link href="/compte/favoris" onClick={() => setIsMobileMenuOpen(false)} className="text-lg flex items-center gap-3">
                <Heart size={20} /> {t('nav.wishlist')} ({wishlistCount})
              </Link>

              <div className="mt-auto pt-8 flex gap-4 text-sm font-sans uppercase tracking-widest text-muted-foreground">
                <button onClick={() => changeLanguage('fr')} className={i18n.language === 'fr' ? 'text-foreground font-bold' : ''}>FR</button>
                <button onClick={() => changeLanguage('ar')} className={i18n.language === 'ar' ? 'text-foreground font-bold' : ''}>AR</button>
                <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'text-foreground font-bold' : ''}>EN</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
