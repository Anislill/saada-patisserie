import * as React from "react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { getUserProfile, saveUserProfile } from "@/lib/firestore";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  /* Load profile from Firestore on mount */
  React.useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    getUserProfile(user.uid)
      .then((profile) => {
        if (profile) {
          setFirstName(profile.firstName ?? "");
          setLastName(profile.lastName ?? "");
          setPhone(profile.phone ?? "");
          setAddress(profile.address ?? "");
          setPostalCode(profile.postalCode ?? "");
          setCity(profile.city ?? "");
        }
      })
      .catch((err) => console.error("[profile] Failed to load profile:", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await saveUserProfile(user.uid, {
        firstName,
        lastName,
        phone,
        address,
        postalCode,
        city,
      });
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
    } catch (err) {
      console.error("[profile] Save failed:", err);
      toast({ title: "Erreur", description: "Impossible d'enregistrer vos informations.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AccountLayout activeTab="profil">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Chargement…
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="profil">
      <div className="max-w-2xl animate-in fade-in duration-500">
        <h2 className="text-2xl font-serif mb-8">Informations Personnelles</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié.</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+216 XX XXX XXX"
              />
            </div>
          </div>

          {/* Address section */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-4">Adresse de livraison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Adresse</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Numéro et nom de rue"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Code Postal</label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Ex: 1000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Tunis"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement…" : "Enregistrer les modifications"}
            </Button>
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
