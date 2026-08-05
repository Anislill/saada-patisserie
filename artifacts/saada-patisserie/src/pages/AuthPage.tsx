import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);

  // Already logged in → go straight to profile
  React.useEffect(() => {
    if (user) setLocation("/compte/profil");
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged in App.tsx will update the store
        toast({ title: "Connexion réussie", description: "Bienvenue dans l'univers Saada Pâtisserie." });
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName.trim()) {
          await updateProfile(cred.user, { displayName: fullName.trim() });
        }
        toast({ title: "Compte créé", description: "Bienvenue dans l'univers Saada Pâtisserie." });
      }
      setLocation("/compte/profil");
    } catch (err: any) {
      const code: string = err?.code ?? "";
      let msg = "Une erreur est survenue. Veuillez réessayer.";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        msg = "Email ou mot de passe incorrect.";
      } else if (code === "auth/email-already-in-use") {
        msg = "Cet email est déjà utilisé. Essayez de vous connecter.";
      } else if (code === "auth/weak-password") {
        msg = "Le mot de passe doit contenir au moins 6 caractères.";
      } else if (code === "auth/too-many-requests") {
        msg = "Trop de tentatives. Veuillez réessayer plus tard.";
      } else if (code === "auth/invalid-email") {
        msg = "Adresse email invalide.";
      }
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({ title: "Email requis", description: "Saisissez votre email ci-dessus puis cliquez à nouveau.", variant: "destructive" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      toast({ title: "Email envoyé", description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe." });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer l'email. Vérifiez l'adresse saisie.", variant: "destructive" });
    }
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
                className={`pb-3 px-2 text-sm font-sans uppercase tracking-widest transition-colors border-b-2 ${isLogin ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground"}`}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`pb-3 px-2 text-sm font-sans uppercase tracking-widest transition-colors border-b-2 ${!isLogin ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground"}`}
              >
                Inscription
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom complet</label>
                <Input
                  required
                  placeholder="Votre nom"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Mot de passe</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    {resetSent ? "Email envoyé ✓" : "Mot de passe oublié ?"}
                  </button>
                )}
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Chargement…" : isLogin ? "Se connecter" : "Créer mon compte"}
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
