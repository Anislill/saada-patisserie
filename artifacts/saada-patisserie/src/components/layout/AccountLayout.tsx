import * as React from "react";
import { Link, useLocation } from "wouter";
import { LogOut, User, ShoppingBag, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuthStore } from "@/store/authStore";

export function AccountLayout({ children, activeTab }: { children: React.ReactNode, activeTab: string }) {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuthStore();

  React.useEffect(() => {
    if (!user) {
      setLocation("/compte");
    }
  }, [user, setLocation]);

  const handleLogout = () => {
    setUser(null);
    setLocation("/");
  };

  if (!user) return null;

  const tabs = [
    { id: "profil", label: "Mon Profil", icon: User, path: "/compte/profil" },
    { id: "commandes", label: "Mes Commandes", icon: ShoppingBag, path: "/compte/commandes" },
    { id: "favoris", label: "Mes Favoris", icon: Heart, path: "/compte/favoris" },
  ];

  const initials = (() => {
    const name = user?.displayName ?? "";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (user?.email?.[0] ?? "C").toUpperCase();
  })();

  return (
    <Layout>
      {/* Page header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-secondary/15 border border-secondary/25 flex items-center justify-center shrink-0">
              <span className="text-lg font-serif font-medium text-secondary tracking-wide">{initials}</span>
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-1">Mon Compte</p>
              <h1 className="text-2xl md:text-3xl font-serif text-foreground leading-none">
                {user?.displayName || "Client"}
              </h1>
              {user?.email && (
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-10">

          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
            <nav className="flex flex-col">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.path}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all mb-0.5 ${
                      isActive
                        ? "bg-secondary/10 text-secondary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-secondary" : ""} />
                    {tab.label}
                  </Link>
                );
              })}

              <div className="border-t border-border mt-3 pt-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-md transition-all"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </button>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>
      </div>
    </Layout>
  );
}
