import * as React from "react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import hero2 from "@assets/generated_images/hero-2.jpg";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";

export default function AboutPage() {
  const settings = useSiteSettingsStore((s) => s.settings);
  const aboutImage = settings.aboutImageUrl || hero2;

  return (
    <Layout>
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <SectionReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">{settings.aboutHeroTitle}</h1>
            <p className="text-lg text-muted-foreground font-serif italic">
              "{settings.aboutHeroQuote}"
            </p>
          </SectionReveal>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <SectionReveal className="lg:w-1/2">
            <div className="aspect-[4/5] w-full max-w-md mx-auto relative overflow-hidden bg-muted">
              <img src={aboutImage} alt={settings.aboutStoryTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-4 border border-secondary/50 pointer-events-none" />
            </div>
          </SectionReveal>
          
          <SectionReveal className="lg:w-1/2 space-y-6" delay={0.2}>
            <h2 className="text-3xl font-serif text-foreground">{settings.aboutStoryTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {settings.aboutStoryParagraph1}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {settings.aboutStoryParagraph2}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {settings.aboutStoryParagraph3}
            </p>
          </SectionReveal>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-secondary">{settings.aboutValuesTitle}</h2>
          </SectionReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <SectionReveal delay={0.1}>
              <h3 className="text-xl font-serif text-secondary mb-4">{settings.aboutValue1Title}</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {settings.aboutValue1Text}
              </p>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <h3 className="text-xl font-serif text-secondary mb-4">{settings.aboutValue2Title}</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {settings.aboutValue2Text}
              </p>
            </SectionReveal>
            <SectionReveal delay={0.3}>
              <h3 className="text-xl font-serif text-secondary mb-4">{settings.aboutValue3Title}</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {settings.aboutValue3Text}
              </p>
            </SectionReveal>
          </div>
        </div>
      </div>
    </Layout>
  );
}
