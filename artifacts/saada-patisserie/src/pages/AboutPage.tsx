import * as React from "react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import hero2 from "@assets/generated_images/hero-2.jpg";

export default function AboutPage() {
  return (
    <Layout>
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <SectionReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">Notre Histoire</h1>
            <p className="text-lg text-muted-foreground font-serif italic">
              "L'alliance de l'élégance parisienne et de la générosité orientale."
            </p>
          </SectionReveal>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <SectionReveal className="lg:w-1/2">
            <div className="aspect-[4/5] w-full max-w-md mx-auto relative overflow-hidden bg-muted">
              <img src={hero2} alt="Atelier Saada" className="w-full h-full object-cover" />
              <div className="absolute inset-4 border border-secondary/50 pointer-events-none" />
            </div>
          </SectionReveal>
          
          <SectionReveal className="lg:w-1/2 space-y-6" delay={0.2}>
            <h2 className="text-3xl font-serif text-foreground">Une passion transmise</h2>
            <p className="text-muted-foreground leading-relaxed">
              Fondée en 1998, Saada Pâtisserie est née d'un rêve : marier la précision de la haute pâtisserie française avec les saveurs chaudes et réconfortantes du Moyen-Orient. Ce qui a commencé comme un petit atelier s'est transformé en une véritable institution du goût.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Chaque jour, nos maîtres artisans sélectionnent avec le plus grand soin nos matières premières. Les pistaches arrivent tout droit d'Iran, les amandes de Sicile, l'eau de rose de Damas, et notre beurre bénéficie de l'Appellation d'Origine Protégée. 
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Il n'y a pas de secret, seulement du temps, de la rigueur et beaucoup d'amour. Nos feuilletages sont travaillés à la main, nos cuissons surveillées à la seconde près, pour vous offrir un croustillant et un fondant inégalés.
            </p>
          </SectionReveal>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-secondary">Nos Valeurs</h2>
          </SectionReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <SectionReveal delay={0.1}>
              <h3 className="text-xl font-serif text-secondary mb-4">Excellence</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Le refus du compromis. Seuls les meilleurs ingrédients franchissent les portes de notre atelier.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <h3 className="text-xl font-serif text-secondary mb-4">Artisanat</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Le geste précis, la main qui façonne. Toutes nos créations sont confectionnées de manière traditionnelle.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.3}>
              <h3 className="text-xl font-serif text-secondary mb-4">Générosité</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Parce qu'une pâtisserie est avant tout un moment de partage, nous mettons tout notre cœur dans nos recettes.
              </p>
            </SectionReveal>
          </div>
        </div>
      </div>
    </Layout>
  );
}
