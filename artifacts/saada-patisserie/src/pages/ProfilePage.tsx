import * as React from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { User, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { getUserProfile, saveUserProfile } from "@/lib/firestore";

function ProfileSkeleton() {
  return (
    <AccountLayout activeTab="profil">
      <div className="max-w-2xl space-y-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-border rounded-lg p-6">
            <div className="h-4 w-36 bg-muted rounded mb-5" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
              <div className="col-span-2 h-10 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </AccountLayout>
  );
}

function SectionCard({ icon: Icon, title, children }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg bg-background">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
        <Icon size={16} className="text-secondary shrink-0" />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  );
}

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

  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [showCurrentPw, setShowCurrentPw] = React.useState(false);
  const [showNewPw, setShowNewPw] = React.useState(false);
  const [showConfirmPw, setShowConfirmPw] = React.useState(false);

  React.useEffect(() => {
    if (!user) { setIsLoading(false); return; }
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
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast({ title: "Mot de passe modifié", description: "Votre mot de passe a été mis à jour avec succès." });
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
        msg = "Session expirée. Veuillez vous déconnecter puis vous reconnecter.";
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
      await saveUserProfile(user.uid, { firstName, lastName, phone, address, postalCode, city });
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
    } catch (err) {
      console.error("[profile] Save failed:", err);
      toast({ title: "Erreur", description: "Impossible d'enregistrer vos informations.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <AccountLayout activeTab="profil">
      <div className="max-w-2xl animate-in fade-in duration-500">
        <h2 className="text-2xl font-serif text-foreground mb-6">Informations Personnelles</h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Personal info card */}
          <SectionCard icon={User} title="Identité">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prénom</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nom</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                <Input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="bg-muted/50 text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">L'adresse email ne peut pas être modifiée.</p>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Téléphone</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>
          </SectionCard>

          {/* Address card */}
          <SectionCard icon={MapPin} title="Adresse de livraison">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Adresse</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Numéro et nom de rue"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Code Postal</label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Ex : 1000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ville</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex : Tunis"
                />
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="min-w-[180px]">
              {isSaving ? "Enregistrement…" : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>

        {/* Password card — outside the main form */}
        <div className="mt-5">
          <SectionCard icon={Lock} title="Mot de passe">
            {!showPasswordForm ? (
              <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(true)}>
                Modifier mon mot de passe
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm animate-in fade-in duration-300">
                {/* Current password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPw ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isChangingPassword}
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowCurrentPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPw ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isChangingPassword}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">6 caractères minimum.</p>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPw ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isChangingPassword}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button type="submit" size="sm" disabled={isChangingPassword}>
                    {isChangingPassword ? "Modification…" : "Confirmer"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
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
          </SectionCard>
        </div>
      </div>
    </AccountLayout>
  );
}
