import * as React from "react";
import { Link, useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  // Using a mock auth logic since Firebase might not be configured
  const { user, setUser } = useAuthStore();

  React.useEffect(() => {
    if (user) {
      setLocation("/compte/profil");
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login/register
    setTimeout(() => {
      setUser({ uid: "mock-user-123", email: "client@example.com", displayName: "Client Saada" } as any);
      toast({
        title: isLogin ? "Connexion réussie" : "Compte créé",
        description: "Bienvenue dans l'univers Saada Pâtisserie.",
      });
      setLocation("/compte/profil");
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif mb-4">Mon Compte</h1>
            <div className="flex justify-center gap-8 border-b border-border">
              <button 
                onClick={() => setIsLogin(true)}
                className={`pb-3 px-2 text-sm font-sans uppercase tracking-widest transition-colors border-b-2 ${isLogin ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground'}`}
              >
                Connexion
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`pb-3 px-2 text-sm font-sans uppercase tracking-widest transition-colors border-b-2 ${!isLogin ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground'}`}
              >
                Inscription
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom complet</label>
                <Input required placeholder="Votre nom" />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" required placeholder="vous@exemple.com" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Mot de passe</label>
                {isLogin && (
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground underline">
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <Input type="password" required placeholder="••••••••" />
            </div>

            <Button type="submit" size="lg" className="w-full">
              {isLogin ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">Nouveau client sans compte ?</p>
            <Link href="/commande">
              <Button variant="outline" className="w-full">
                Continuer en tant qu'invité
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
