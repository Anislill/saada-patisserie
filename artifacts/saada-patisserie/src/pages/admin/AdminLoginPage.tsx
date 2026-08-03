import * as React from "react";
import { useLocation } from "wouter";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/0_file_00000000873481f494288e53319f68ef-removebg-preview_1785313194757.png";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in AdminLayout will handle the redirect
      setLocation("/admin/dashboard");
    } catch (err: any) {
      console.error("[AdminLogin] Firebase error:", err?.code, err?.message);
      const code: string = err?.code ?? "";
      let description = "Email ou mot de passe incorrect.";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        description = "Email ou mot de passe incorrect.";
      } else if (code === "auth/too-many-requests") {
        description = "Trop de tentatives. Réessayez plus tard.";
      } else if (code === "auth/unauthorized-domain") {
        description = `Domaine non autorisé dans Firebase. Ajoutez ce domaine dans Firebase Console → Authentication → Settings → Authorized domains : ${window.location.hostname}`;
      } else if (err?.message) {
        description = err.message;
      }
      toast({
        title: "Échec de connexion",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="bg-background border border-border p-8 rounded-sm shadow-sm max-w-md w-full text-center">
        <img src={logoPath} alt="Saada Admin" className="h-16 mx-auto mb-8" />
        <h1 className="text-2xl font-serif mb-6 text-foreground">Accès Réservé</h1>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium">Email administrateur</label>
            <Input
              type="email"
              required
              placeholder="admin@saada-patisserie.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mot de passe</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Connexion…" : "Connexion"}
          </Button>
        </form>
      </div>
    </div>
  );
}
