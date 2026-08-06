import * as React from "react";
import Layout from "@/components/layout/Layout";
import { SectionReveal } from "@/components/SectionReveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";

export default function ContactPage() {
  const { toast } = useToast();
  const { settings } = useSiteSettingsStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Notre équipe vous répondra dans les plus brefs délais."
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <SectionReveal>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Contactez-nous</h1>
            <p className="text-lg text-muted-foreground">
              Une question sur une commande, un événement spécial ou simplement l'envie de nous dire bonjour ? Nous sommes à votre écoute.
            </p>
          </SectionReveal>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <SectionReveal className="w-full lg:w-1/3 space-y-12">
            <div>
              <h2 className="text-2xl font-serif mb-8">Nos coordonnées</h2>
              <div className="space-y-6">
                {settings.address && (
                  <div className="flex items-start gap-4">
                    <MapPin className="text-secondary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Boutique & Atelier</h3>
                      <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">{settings.address}</p>
                    </div>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-start gap-4">
                    <Phone className="text-secondary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        <a href={`tel:${settings.phone}`} className="hover:text-secondary transition-colors">{settings.phone}</a>
                      </p>
                    </div>
                  </div>
                )}
                {settings.email && (
                  <div className="flex items-start gap-4">
                    <Mail className="text-secondary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        <a href={`mailto:${settings.email}`} className="hover:text-secondary transition-colors">{settings.email}</a>
                      </p>
                    </div>
                  </div>
                )}
                {settings.openingHours && (
                  <div className="flex items-start gap-4">
                    <Clock className="text-secondary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Horaires</h3>
                      <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">{settings.openingHours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="w-full lg:w-2/3" delay={0.2}>
            <div className="bg-background border border-border p-8 md:p-12">
              <h2 className="text-2xl font-serif mb-8">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom complet *</label>
                    <Input required placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input type="email" required placeholder="vous@exemple.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sujet *</label>
                  <Input required placeholder="Sujet de votre message" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <textarea 
                    required 
                    rows={6}
                    className="flex w-full border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Envoyer le message
                </Button>
              </form>
            </div>
          </SectionReveal>
          
        </div>
      </div>
    </Layout>
  );
}
