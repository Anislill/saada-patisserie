import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import monogramPath from "@assets/file_00000000c4108210b2cf7213fa8a58a6-removebg-preview_1785497038065.png";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

/* ─── Ornament SVG ───────────────────────────────────────────── */
function GoldOrnament() {
  return (
    <svg width="120" height="12" viewBox="0 0 120 12" fill="none" className="mx-auto">
      <line x1="0" y1="6" x2="48" y2="6" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="60" cy="6" r="4" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="60" cy="6" r="1.5" fill="#C9A867" />
      <line x1="72" y1="6" x2="120" y2="6" stroke="#C9A867" strokeWidth="0.75" />
    </svg>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);

  React.useEffect(() => {
    if (user) setLocation("/compte/profil");
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
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
      toast({ title: "Email envoyé", description: "Vérifiez votre boîte de réception." });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer l'email. Vérifiez l'adresse saisie.", variant: "destructive" });
    }
  };

  const switchTab = (login: boolean) => {
    setIsLogin(login);
    setShowPassword(false);
    setResetSent(false);
  };

  return (
    <Layout>
      {/* Full-height split container */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-140px)]">

        {/* ── Left brand panel ── */}
        <div className="hidden md:flex md:w-[420px] lg:w-[480px] xl:w-[520px] shrink-0 bg-primary flex-col items-center justify-center px-12 py-16 relative overflow-hidden">
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                #C9A867 0px, #C9A867 1px,
                transparent 1px, transparent 12px
              )`
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-secondary/40" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-secondary/40" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-secondary/40" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-secondary/40" />

          {/* Brand content */}
          <div className="relative text-center">
            {/* Logo mark */}
            <div className="mb-8 flex justify-center">
              <img src={monogramPath} alt="Saada" className="w-20 h-20 object-contain opacity-90" style={{ filter: "brightness(0) invert(1)" }} />
            </div>

            <p className="text-secondary/80 text-xs font-sans tracking-[0.35em] uppercase mb-3">
              Pâtisserie artisanale
            </p>
            <h2 className="text-primary-foreground font-serif text-4xl xl:text-5xl leading-tight mb-6">
              Saada
            </h2>

            <GoldOrnament />

            <p className="mt-8 text-primary-foreground/60 font-sans text-sm leading-relaxed max-w-[260px] mx-auto">
              Des créations uniques pour des moments&nbsp;inoubliables.
            </p>

            {/* Bottom tagline */}
            <div className="mt-16 pt-8 border-t border-secondary/20">
              <p className="text-secondary/50 text-xs font-sans tracking-widest uppercase">
                L'art de la pâtisserie depuis 2010
              </p>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex items-center justify-center bg-background px-6 py-14 md:px-12 lg:px-16">
          <div className="w-full max-w-[400px]">

            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-1">
                {isLogin ? "Connexion" : "Créer un compte"}
              </h1>
              <div className="w-10 h-0.5 bg-secondary mt-3 mb-6" />
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Accédez à votre espace personnel."
                  : "Rejoignez l'univers Saada Pâtisserie."}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-0 mb-8 border-b border-border">
              {[
                { id: true,  label: "Connexion" },
                { id: false, label: "Inscription" },
              ].map(({ id, label }) => (
                <button
                  key={String(id)}
                  onClick={() => switchTab(id)}
                  className={`pb-3 mr-6 text-xs font-sans uppercase tracking-[0.18em] transition-all border-b-2 -mb-px ${
                    isLogin === id
                      ? "border-secondary text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium font-sans uppercase tracking-wider text-muted-foreground">
                    Nom complet
                  </label>
                  <Input
                    required
                    placeholder="Votre nom"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium font-sans uppercase tracking-wider text-muted-foreground">
                  Adresse email
                </label>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium font-sans uppercase tracking-wider text-muted-foreground">
                    Mot de passe
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className={`text-xs transition-colors ${
                        resetSent
                          ? "text-secondary"
                          : "text-muted-foreground hover:text-secondary"
                      }`}
                    >
                      {resetSent ? "✓ Email envoyé" : "Mot de passe oublié ?"}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">6 caractères minimum.</p>
                )}
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full tracking-widest uppercase text-xs font-sans"
                  disabled={loading}
                >
                  {loading
                    ? "Chargement…"
                    : isLogin
                    ? "Se connecter"
                    : "Créer mon compte"}
                </Button>
              </div>
            </form>

            {/* Guest option */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-widest">
                ou
              </p>
              <Link href="/commande">
                <Button
                  variant="outline"
                  className="w-full tracking-widest uppercase text-xs font-sans"
                >
                  Continuer en tant qu'invité
                </Button>
              </Link>
            </div>

            {/* Switch mode hint on mobile */}
            <p className="text-center text-xs text-muted-foreground mt-8">
              {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <button
                onClick={() => switchTab(!isLogin)}
                className="text-secondary underline-offset-2 hover:underline"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>

          </div>
        </div>

      </div>
    </Layout>
  );
}
