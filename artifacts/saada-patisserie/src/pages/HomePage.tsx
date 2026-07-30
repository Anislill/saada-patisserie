import * as React from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEED_CATEGORIES, SEED_TESTIMONIALS } from "@/lib/firestore";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";

import hero1 from "@assets/generated_images/hero-1.jpg";
import hero2 from "@assets/generated_images/hero-2.jpg";

const CATEGORY_STYLES = [
  "from-[#1F3D2E] to-[#2C5240]",
  "from-[#162B20] to-[#1F3D2E]",
  "from-[#2A4A35] to-[#1a3226]",
  "from-[#0f2219] to-[#1F3D2E]",
];

export default function HomePage() {
  const { t } = useTranslation();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" });
  const { heroImageUrl } = useSiteSettingsStore();
  const heroImage = heroImageUrl || hero1;

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Saada Pâtisserie"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-sm md:text-base font-serif italic tracking-wide mb-4 opacity-90"
          >
            {t('home.heroSubtitle')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif mb-10"
          >
            {t('home.heroTitle')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/boutique">
              <Button size="lg" className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-secondary hover:text-secondary-foreground uppercase tracking-widest text-sm px-8">
                {t('home.ctaOrder')}
              </Button>
            </Link>
            <Link href="/a-propos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary uppercase tracking-widest text-sm px-8">
                {t('home.ctaDiscover')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Nos Catégories (Fostka-style) ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <SectionReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
                Nos Catégories
              </h2>
              <p className="text-muted-foreground text-sm md:text-base font-serif italic">
                Des créations artisanales pour chaque occasion
              </p>
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 mt-5 text-xs uppercase tracking-[0.18em] font-sans text-primary border-b border-secondary pb-0.5 hover:text-secondary transition-colors"
              >
                Voir la boutique <ArrowRight size={13} />
              </Link>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {SEED_CATEGORIES.map((cat, idx) => (
              <SectionReveal key={cat.id} delay={idx * 0.08}>
                <Link
                  href={`/boutique?category=${cat.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden flex flex-col justify-end block"
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${CATEGORY_STYLES[idx % CATEGORY_STYLES.length]} transition-transform duration-700 group-hover:scale-105`}
                  />
                  {/* Gold inner border */}
                  <div className="absolute inset-[1px] border border-secondary/20 group-hover:border-secondary/50 transition-colors duration-400 pointer-events-none" />
                  {/* Text */}
                  <div className="relative z-10 p-4 md:p-6">
                    <div className="h-px w-6 bg-secondary mb-3 group-hover:w-10 transition-all duration-500" />
                    <h3 className="font-serif text-white text-base md:text-lg lg:text-xl leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-white/50 text-[10px] md:text-xs mt-2 uppercase tracking-widest font-sans group-hover:text-white/80 transition-colors duration-300">
                      Découvrir →
                    </p>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story ── */}
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

      {/* ── Testimonials ── */}
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
                {SEED_TESTIMONIALS.map((testimonial) => (
                  <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4">
                    <div className="bg-muted/50 p-8 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-6 text-secondary">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill={i < testimonial.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                          ))}
                        </div>
                        <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-8">
                          "{testimonial.text}"
                        </p>
                      </div>
                      <p className="font-sans uppercase tracking-widest text-sm font-medium">
                        — {testimonial.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Newsletter */}
          <SectionReveal>
            <div className="mt-20 max-w-xl mx-auto text-center">
              <h3 className="text-2xl font-serif mb-3">{t('home.newsletter')}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t('home.newsletterSub')}</p>
              <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1"
                />
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  S'inscrire
                </Button>
              </form>
            </div>
          </SectionReveal>
        </div>
      </section>
    </Layout>
  );
}
