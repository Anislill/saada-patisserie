import * as React from "react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
  const faqs = [
    {
      category: "Commandes & Livraison",
      items: [
        { q: "Quels sont les délais de livraison ?", a: "Pour Paris et la petite couronne, nous livrons en 24h à 48h. Pour le reste de la France, comptez 48h à 72h via notre partenaire Chronofresh pour garantir la fraîcheur." },
        { q: "Puis-je retirer ma commande en boutique ?", a: "Oui, le Click & Collect est disponible gratuitement dans notre boutique parisienne du mardi au dimanche." },
        { q: "Faites-vous des livraisons à l'international ?", a: "Actuellement, nous livrons uniquement en France métropolitaine pour garantir la fraîcheur optimale de nos produits." },
      ]
    },
    {
      category: "Produits & Conservation",
      items: [
        { q: "Combien de temps se conservent vos pâtisseries ?", a: "Nos pâtisseries se conservent idéalement entre 3 et 5 jours au réfrigérateur. Nous vous conseillons de les sortir 15 minutes avant dégustation." },
        { q: "Vos produits contiennent-ils du gluten ?", a: "La majorité de nos créations contiennent du gluten (farine de blé) et des fruits à coque. Veuillez consulter l'onglet 'Allergènes' sur chaque fiche produit." },
      ]
    },
    {
      category: "Paiement",
      items: [
        { q: "Quels sont les moyens de paiement acceptés ?", a: "Nous acceptons les cartes Visa, Mastercard, American Express, ainsi que Apple Pay et Google Pay." },
      ]
    }
  ];

  return (
    <Layout>
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <SectionReveal>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Questions Fréquentes</h1>
            <p className="text-lg text-muted-foreground">
              Retrouvez ici les réponses aux questions les plus courantes.
            </p>
          </SectionReveal>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 max-w-3xl">
        <div className="space-y-12">
          {faqs.map((group, gIdx) => (
            <SectionReveal key={gIdx} delay={gIdx * 0.1}>
              <h2 className="text-2xl font-serif mb-6">{group.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((item, iIdx) => (
                  <AccordionItem value={`item-${gIdx}-${iIdx}`} key={iIdx}>
                    <AccordionTrigger className="text-left font-medium hover:text-secondary">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SectionReveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
