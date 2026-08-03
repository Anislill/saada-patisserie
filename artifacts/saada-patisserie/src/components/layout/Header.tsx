import * as React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";
import monogramPath from "@assets/file_00000000c4108210b2cf7213fa8a58a6-removebg-preview_1785497038065.png";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

/* reusable animated icon button */
function IconBtn({
  onClick,
  label,
  className = "",
  children,
}: {
  onClick?: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className={`relative text-foreground transition-colors ${className}`}
      whileHover={{ scale: 1.15, y: -1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

/* animated nav link with sliding underline */
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <motion.span
        className={`relative text-sm uppercase tracking-widest cursor-pointer pb-0.5
          ${active ? "text-secondary font-medium" : "text-foreground"}`}
        whileHover="hovered"
        initial="rest"
        animate="rest"
      >
        {children}
        {/* underline bar */}
        <motion.span
          className="absolute bottom-0 left-0 h-px bg-secondary block"
          variants={{
            rest:    { scaleX: active ? 1 : 0, originX: 0 },
            hovered: { scaleX: 1,               originX: 0 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ width: "100%" }}
        />
      </motion.span>
    </Link>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.productIds.length);

  const announcementText = useSiteSettingsStore((s) => s.settings.announcementBar);
  const announcementActive = useSiteSettingsStore((s) => s.settings.announcementActive);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [userDismissed, setUserDismissed] = React.useState(false);
  const showAnnouncement = announcementActive && !userDismissed && !!announcementText;

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/",         label: t("nav.home")  },
    { href: "/boutique", label: t("nav.shop")  },
    { href: "/a-propos", label: t("nav.about") },
    { href: "/contact",  label: t("nav.contact") },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-primary-foreground py-2 px-4 text-xs md:text-sm text-center relative overflow-hidden"
          >
            <div className="whitespace-nowrap overflow-hidden">
              <span className="inline-block animate-[marquee_15s_linear_infinite]">
                {announcementText}
              </span>
            </div>
            <motion.button
              onClick={() => setUserDismissed(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <X size={16} />
            </motion.button>
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
          <motion.button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Menu"
          >
            <Menu size={24} />
          </motion.button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 md:gap-3">
            <motion.img
              src={monogramPath}
              alt="Saada monogram"
              className="h-[88px] md:h-[108px] w-auto object-contain"
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <div className="flex flex-col justify-center leading-none">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#111111",
                  fontSize: "clamp(1.35rem, 5vw, 2rem)",
                  fontWeight: 500,
                  letterSpacing: "0.25em",
                  lineHeight: 1,
                }}
              >
                SAADA
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#C49A3C",
                  fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
                  fontWeight: 500,
                  letterSpacing: "0.22em",
                  lineHeight: 1,
                  marginTop: "6px",
                }}
              >
                PÂTISSERIE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} active={location === link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <IconBtn onClick={() => setIsSearchOpen(true)} label="Rechercher" className="hover:text-secondary">
              <Search size={20} strokeWidth={1.5} />
            </IconBtn>

            <IconBtn label="Favoris" className="hover:text-secondary hidden md:flex">
              <Link href="/compte/favoris" className="flex items-center">
                <Heart size={20} strokeWidth={1.5} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </IconBtn>

            <IconBtn label="Mon compte" className="hover:text-secondary hidden md:flex">
              <Link href="/compte">
                <User size={20} strokeWidth={1.5} />
              </Link>
            </IconBtn>

            <IconBtn onClick={() => setIsCartOpen(true)} label="Panier" className="hover:text-secondary">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.35, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.35, ease: "backOut" }}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </IconBtn>
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
              <img src={monogramPath} alt="Saada" className="h-8 w-auto object-contain" />
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 24 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif text-foreground hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="my-4 border-t border-border" />

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.07, type: "spring", stiffness: 300, damping: 24 }}
              >
                <Link href="/compte" onClick={() => setIsMobileMenuOpen(false)} className="text-lg flex items-center gap-3 hover:text-secondary transition-colors">
                  <User size={20} /> {t("nav.account")}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.07, type: "spring", stiffness: 300, damping: 24 }}
              >
                <Link href="/compte/favoris" onClick={() => setIsMobileMenuOpen(false)} className="text-lg flex items-center gap-3 hover:text-secondary transition-colors">
                  <Heart size={20} /> {t("nav.wishlist")} ({wishlistCount})
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
