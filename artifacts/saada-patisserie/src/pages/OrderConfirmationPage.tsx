import * as React from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  // Order ID passed by CheckoutPage via query string; fall back to session storage
  const orderId =
    params.get("id") ??
    sessionStorage.getItem("lastOrderId") ??
    "CMD" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

  // Clear session storage after reading
  React.useEffect(() => {
    sessionStorage.removeItem("lastOrderId");
  }, []);

  return (
    <Layout>
      <div className="flex-1 container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">

        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground mb-8">
          <CheckCircle2 size={48} />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Merci pour votre commande !</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          Votre commande a été confirmée et est en cours de préparation. Vous pouvez la suivre depuis votre compte.
        </p>

        <div className="bg-muted/30 border border-border p-6 md:p-8 rounded-sm mb-12 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 text-secondary mb-2">
            <Package size={24} />
            <span className="font-sans uppercase tracking-widest text-sm">Numéro de commande</span>
          </div>
          <p className="text-3xl font-serif">{orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/compte/commandes">
            <Button size="lg" className="w-full">
              Voir mes commandes
            </Button>
          </Link>
          <Link href="/boutique">
            <Button variant="outline" size="lg" className="w-full">
              Continuer mes achats <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </Layout>
  );
}
