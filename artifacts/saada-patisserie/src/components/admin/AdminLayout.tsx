import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageSearch,
  Users,
  Settings,
  LogOut,
  Image,
  Ticket,
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { user, setUser, setLoading, isLoading } = useAuthStore();

  // Single source of truth: Firebase Auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser) {
        setLocation("/admin");
      }
    });
    return unsubscribe;
  }, [setUser, setLoading, setLocation]);

  const handleLogout = async () => {
    await signOut(auth);
    setLocation("/admin");
  };

  // Still resolving auth state — show nothing to avoid flash
  if (isLoading) return null;

  // Not authenticated — redirect handled by onAuthStateChanged, render nothing
  if (!user) return null;

  const menu = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: "commandes", label: "Commandes", icon: ShoppingBag, path: "/admin/commandes" },
    { id: "produits", label: "Produits", icon: PackageSearch, path: "/admin/produits" },
    { id: "clients", label: "Clients", icon: Users, path: "/admin/clients" },
    { id: "promotions", label: "Promotions", icon: Ticket, path: "/admin/promotions" },
    { id: "contenu", label: "Contenu", icon: Image, path: "/admin/contenu" },
    { id: "parametres", label: "Paramètres", icon: Settings, path: "/admin/parametres" },
  ];

  return (
    <div className="min-h-screen flex bg-muted/20 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] text-white flex flex-col hidden lg:flex shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif text-2xl text-secondary">Saada Admin</h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-secondary text-black font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-white/70 hover:bg-white/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-6 lg:hidden">
          <h1 className="font-serif text-xl">Saada Admin</h1>
          <button onClick={handleLogout} className="text-muted-foreground">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
