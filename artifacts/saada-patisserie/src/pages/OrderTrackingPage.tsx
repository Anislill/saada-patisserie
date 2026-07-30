import * as React from "react";
import { Package, Clock, Truck, CheckCircle2, Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [result, setResult] = React.useState<null | any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Mock API call delay
    setTimeout(() => {
      setIsSearching(false);
      setResult({
        id: orderNumber || "CMD123456",
        date: new Date().toLocaleDateString('fr-FR'),
        status: 2, // 1: Confirmed, 2: Prep, 3: Delivery, 4: Done
        total: 124.90
      });
    }, 1000);
  };

  const steps = [
    { id: 1, label: "Confirmée", icon: CheckCircle2, desc: "Votre commande est validée" },
    { id: 2, label: "En préparation", icon: Package, desc: "Nos artisans préparent vos pâtisseries" },
    { id: 3, label: "En livraison", icon: Truck, desc: "Votre colis est en route" },
    { id: 4, label: "Livrée", icon: CheckCircle2, desc: "Commande livrée avec succès" },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 py-12 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Suivi de commande</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Entrez votre numéro de commande et votre email pour suivre l'avancement de votre livraison en temps réel.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <Input 
              required
              placeholder="N° de commande (ex: CMD123456)" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 bg-background"
            />
            <Input 
              required
              type="email"
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background"
            />
            <Button type="submit" disabled={isSearching} className="w-full sm:w-auto">
              {isSearching ? "Recherche..." : <><Search size={18} className="mr-2" /> Suivre</>}
            </Button>
          </form>
        </div>
      </div>

      {result && (
        <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-6 border-b border-border gap-4">
            <div>
              <h2 className="text-2xl font-serif mb-1">Commande {result.id}</h2>
              <p className="text-muted-foreground">Passée le {result.date}</p>
            </div>
            <div className="text-xl font-medium">
              Total: {result.total.toFixed(2)} €
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-8 left-8 bottom-8 w-0.5 bg-border hidden md:block" />
            
            <div className="space-y-10 relative">
              {steps.map((step, idx) => {
                const isActive = result.status >= step.id;
                const isCurrent = result.status === step.id;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex gap-6 md:gap-12">
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500
                      ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-2 border-border'}
                      ${isCurrent ? 'ring-4 ring-secondary/30 ring-offset-4 ring-offset-background' : ''}
                    `}>
                      <Icon size={24} />
                    </div>
                    <div className={`flex-1 pt-3 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                      <h3 className="text-xl font-serif mb-1">{step.label}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                      {isCurrent && step.id === 2 && (
                        <div className="mt-4 p-4 bg-muted border border-border flex gap-4 items-start">
                          <Clock className="text-secondary shrink-0 mt-0.5" size={20} />
                          <div>
                            <p className="font-medium text-sm">Mise à jour</p>
                            <p className="text-sm text-muted-foreground mt-1">Vos pâtisseries sont en cours d'assemblage par le Chef. Elles seront bientôt prêtes pour l'expédition.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
