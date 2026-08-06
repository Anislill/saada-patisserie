import * as React from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logoPath from "@assets/logo-white.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSiteSettingsStore();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t-4 border-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <img src={logoPath} alt="Saada Pâtisserie" className="h-35 object-contain" />
            </div>
            <p className="text-primary-foreground/80 font-serif italic mb-6 text-center md:text-left">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-secondary flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                  <Instagram size={18} />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-secondary flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-secondary font-sans uppercase tracking-widest text-sm mb-6">{t('footer.links')}</h3>
            <ul className="space-y-4 text-primary-foreground/80">
              <li><Link href="/" className="hover:text-secondary transition-colors">{t('nav.home')}</Link></li>
              <li><Link href="/boutique" className="hover:text-secondary transition-colors">{t('nav.shop')}</Link></li>
              <li><Link href="/a-propos" className="hover:text-secondary transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">{t('nav.contact')}</Link></li>
              <li><Link href="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-secondary font-sans uppercase tracking-widest text-sm mb-6">{t('footer.legal')}</h3>
            <ul className="space-y-4 text-primary-foreground/80">
              <li><Link href="/mentions-legales" className="hover:text-secondary transition-colors">Mentions Légales</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-secondary transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/cgv" className="hover:text-secondary transition-colors">CGV</Link></li>
              <li><Link href="/suivi-commande" className="hover:text-secondary transition-colors">Suivre ma commande</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-secondary font-sans uppercase tracking-widest text-sm mb-6">Newsletter</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              {t('home.newsletterSub')}
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Votre email" 
                className="bg-transparent border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-secondary"
              />
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-primary">
                S'inscrire
              </Button>
            </form>
          </div>

        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Saada Pâtisserie. {t('footer.rights')}</p>
          <div className="flex gap-4 mt-4 md:mt-0 opacity-50">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
