import * as React from "react";
import Layout from "@/components/layout/Layout";

export default function LegalPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-4xl">
        <h1 className="text-4xl font-serif mb-12 text-center">Mentions Légales</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground font-sans leading-relaxed">
          <h2 className="text-foreground font-serif">1. Éditeur du site</h2>
          <p>Le site saada-patisserie.com est édité par la société Saada Pâtisserie SAS, au capital de 10 000€, immatriculée au RCS de Paris sous le numéro 123 456 789.</p>
          <p>Siège social : 123 rue Saint-Honoré, 75001 Paris, France.<br/>Numéro de TVA intracommunautaire : FR 12 3456789</p>

          <h2 className="text-foreground font-serif mt-8">2. Directeur de la publication</h2>
          <p>Le directeur de la publication est M. Exemple, en qualité de Président.</p>

          <h2 className="text-foreground font-serif mt-8">3. Hébergement</h2>
          <p>Le site est hébergé par Replit.<br/>Adresse : San Francisco, CA, USA.</p>

          <h2 className="text-foreground font-serif mt-8">4. Propriété intellectuelle</h2>
          <p>L'ensemble du contenu (textes, images, vidéos, logos, etc.) présent sur ce site est la propriété exclusive de Saada Pâtisserie ou de ses partenaires. Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site est interdite sans l'accord préalable de Saada Pâtisserie.</p>
        </div>
      </div>
    </Layout>
  );
}
