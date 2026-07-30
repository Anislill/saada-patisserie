import * as React from "react";
import Layout from "@/components/layout/Layout";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-4xl">
        <h1 className="text-4xl font-serif mb-12 text-center">Politique de Confidentialité</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground font-sans leading-relaxed">
          <h2 className="text-foreground font-serif">1. Collecte des données</h2>
          <p>Nous collectons les données personnelles que vous nous fournissez volontairement lors de la création d'un compte, du passage d'une commande ou de l'inscription à notre newsletter (nom, prénom, email, adresse, téléphone).</p>

          <h2 className="text-foreground font-serif mt-8">2. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul>
            <li>Le traitement et la livraison de vos commandes</li>
            <li>Le service client et le suivi de vos demandes</li>
            <li>L'envoi de newsletters (si vous y avez consenti)</li>
          </ul>

          <h2 className="text-foreground font-serif mt-8">3. Protection des données</h2>
          <p>Saada Pâtisserie s'engage à assurer la sécurité et la confidentialité de vos données personnelles. Elles ne sont en aucun cas vendues ou cédées à des tiers à des fins commerciales.</p>

          <h2 className="text-foreground font-serif mt-8">4. Vos droits</h2>
          <p>Conformément à la réglementation européenne (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition au traitement de vos données. Pour exercer ces droits, veuillez nous contacter à l'adresse email : privacy@saada-patisserie.com.</p>
        </div>
      </div>
    </Layout>
  );
}
