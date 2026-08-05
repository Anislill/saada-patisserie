import * as React from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
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

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Erreur", description: "Le nouveau mot de passe doit contenir au moins 6 caractères.", variant: "destructive" });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Re-authenticate before changing password (Firebase requirement)
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast({ title: "Mot de passe modifié", description: "Votre mot de passe a été mis à jour avec succès." });
      // Reset form
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const code: string = err?.code ?? "";
      let msg = "Une erreur est survenue. Veuillez réessayer.";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        msg = "Mot de passe actuel incorrect.";
      } else if (code === "auth/too-many-requests") {
        msg = "Trop de tentatives. Veuillez réessayer plus tard.";
      } else if (code === "auth/weak-password") {
        msg = "Le nouveau mot de passe est trop faible (6 caractères minimum).";
      } else if (code === "auth/requires-recent-login") {
        msg = "Session expirée. Veuillez vous déconnecter puis vous reconnecter avant de changer le mot de passe.";
      }
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

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

          {!showPasswordForm ? (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              Modifier mon mot de passe
            </Button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mot de passe actuel</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nouveau mot de passe</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">6 caractères minimum.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isChangingPassword}
                  autoComplete="new-password"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? "Modification…" : "Confirmer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isChangingPassword}
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}
