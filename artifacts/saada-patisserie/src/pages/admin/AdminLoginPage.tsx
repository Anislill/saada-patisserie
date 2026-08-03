import * as React from "react";
import { useLocation } from "wouter";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoPath from "@assets/0_file_00000000873481f494288e53319f68ef-removebg-preview_1785313194757.png";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { setUser, setLoading } = useAuthStore();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLocalLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Update store immediately so AdminLayout renders without waiting
      // for the global onAuthStateChanged to fire
      setUser(cred.user);
      setLoading(false);
      setLocation("/admin/dashboard");
    } catch (err: any) {
      console.error("[AdminLogin] error:", err?.code, err?.message);
      const code: string = err?.code ?? "";

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else if (code === "auth/too-many-requests") {
        setError("محاولات كثيرة جداً. يرجى المحاولة لاحقاً.");
      } else if (code === "auth/unauthorized-domain") {
        setError(
          `النطاق غير مُصرَّح به في Firebase. أضف: ${window.location.hostname} في Firebase Console → Authentication → Settings → Authorized domains`
        );
      } else if (code === "auth/network-request-failed") {
        setError("خطأ في الشبكة. تحقق من الاتصال بالإنترنت.");
      } else {
        setError(err?.message ?? "حدث خطأ غير متوقع.");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="bg-background border border-border p-8 rounded-sm shadow-sm max-w-md w-full text-center">
        <img src={logoPath} alt="Saada Admin" className="h-16 mx-auto mb-8" />
        <h1 className="text-2xl font-serif mb-6 text-foreground">Accès Réservé</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-right leading-relaxed">
            {error}
          </div>
        )}

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
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Connexion en cours…" : "Connexion"}
          </Button>
        </form>
      </div>
    </div>
  );
}
