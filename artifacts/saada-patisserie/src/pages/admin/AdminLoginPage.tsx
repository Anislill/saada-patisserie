import * as React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/0_file_00000000873481f494288e53319f68ef-removebg-preview_1785313194757.png";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { setUser, setIsAdmin } = useAuthStore();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ uid: "admin-123", email: "admin@saada.com", displayName: "Admin Saada" } as any);
    setIsAdmin(true);
    toast({ title: "Connexion réussie", description: "Bienvenue dans le panneau d'administration." });
    setLocation("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="bg-background border border-border p-8 rounded-sm shadow-sm max-w-md w-full text-center">
        <img src={logoPath} alt="Saada Admin" className="h-16 mx-auto mb-8" />
        <h1 className="text-2xl font-serif mb-6 text-foreground">Accès Réservé</h1>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium">Email administrateur</label>
            <Input type="email" required placeholder="admin@saada-patisserie.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Mot de passe</label>
            <Input type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full mt-4">Connexion</Button>
        </form>
      </div>
    </div>
  );
}
