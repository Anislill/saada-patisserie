import * as React from "react";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-24 px-4 text-center">
        <div className="max-w-md">
          <h1 className="text-8xl font-serif text-secondary mb-6">404</h1>
          <h2 className="text-3xl font-serif text-foreground mb-4">Page introuvable</h2>
          <p className="text-muted-foreground mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée. Il semble que cette gourmandise n'est plus au menu.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
