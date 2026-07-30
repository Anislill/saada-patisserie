import * as React from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_TESTIMONIALS } from "@/lib/firestore";

import hero1 from "@assets/generated_images/hero-1.jpg";
import hero2 from "@assets/generated_images/hero-2.jpg";

export default function HomePage() {
  const { t } = useTranslation();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" });

  const bestSellers = SEED_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero1} 
            alt="Saada Pâtisserie Interior" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6"
          >
            {t('home.heroTitle')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl font-sans tracking-wide max-w-2xl mx-auto mb-10 opacity-90"
          >
            {t('home.heroSubtitle')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/boutique">
              <Button size="lg" className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-secondary hover:text-secondary-foreground">
                {t('home.ctaOrder')}
              </Button>
            </Link>
            <Link href="/a-propos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                {t('home.ctaDiscover')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-foreground">
              {t('home.categories')}
            </h2>
          </SectionReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEED_CATEGORIES.map((cat, idx) => (
              <SectionReveal key={cat.id} delay={idx * 0.1}>
                <Link href={`/boutique?category=${cat.slug}`} className="group block relative aspect-[4/5] overflow-hidden bg-muted">
                  {/* We use a placeholder logic or real image for category here. Let's map to existing generated product images for category covers to look good. */}
                  <img 
                    src={SEED_PRODUCTS[idx]?.images[0] || hero2} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-serif text-primary-foreground text-center px-4">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <SectionReveal className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">
              {t('home.bestSellers')}
            </h2>
            <Link href="/boutique" className="hidden md:flex items-center text-sm font-sans uppercase tracking-widest text-primary hover:text-secondary transition-colors">
              Voir tout <ArrowRight size={16} className="ml-2" />
            </Link>
          </SectionReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, idx) => (
              <SectionReveal key={product.id} delay={idx * 0.1}>
                <ProductCard product={product} />
              </SectionReveal>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/boutique">
              <Button variant="outline" className="w-full">Voir tout</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <SectionReveal className="lg:w-1/2">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:ml-0">
                <img 
                  src={hero2} 
                  alt="L'Art de la Pâtisserie" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-secondary hidden md:block" />
              </div>
            </SectionReveal>
            
            <SectionReveal className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-serif text-secondary">
                L'héritage d'un savoir-faire
              </h2>
              <p className="text-lg text-primary-foreground/80 leading-relaxed font-serif italic">
                "Chaque création est une ode à la délicatesse, un pont entre la rigueur de la pâtisserie française et la générosité des saveurs orientales."
              </p>
              <p className="text-primary-foreground/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Depuis plus de deux décennies, Saada Pâtisserie cultive l'art de l'excellence. Nos maîtres pâtissiers sélectionnent les ingrédients les plus nobles — pistaches d'Iran, amandes de Sicile, beurre AOP — pour vous offrir une expérience gustative inoubliable.
              </p>
              <div className="pt-8">
                <Link href="/a-propos">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary">
                    Notre Histoire
                  </Button>
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-foreground">
              {t('home.testimonials')}
            </h2>
          </SectionReveal>
          
          <SectionReveal>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {SEED_TESTIMONIALS.map((t, idx) => (
                  <div key={t.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4">
                    <div className="bg-muted/50 p-8 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-6 text-secondary">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill={i < t.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                          ))}
                        </div>
                        <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-8">
                          "{t.text}"
                        </p>
                      </div>
                      <p className="font-sans uppercase tracking-widest text-sm font-medium">
                        — {t.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

    </Layout>
  );
}
