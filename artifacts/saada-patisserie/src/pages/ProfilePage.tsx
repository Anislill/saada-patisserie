import * as React from "react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
  };

  return (
    <AccountLayout activeTab="profil">
      <div className="max-w-2xl animate-in fade-in duration-500">
        <h2 className="text-2xl font-serif mb-8">Informations Personnelles</h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom</label>
              <Input defaultValue="Client" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input defaultValue="Saada" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue="client@example.com" disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié.</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input type="tel" defaultValue="+33 6 12 34 56 78" />
            </div>
          </div>
          
          <div className="pt-6">
            <Button type="submit">Enregistrer les modifications</Button>
          </div>
        </form>

        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-lg font-medium mb-4">Mot de passe</h3>
          <Button variant="outline">Modifier mon mot de passe</Button>
        </div>
      </div>
    </AccountLayout>
  );
}
