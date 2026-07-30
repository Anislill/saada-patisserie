import * as React from "react";
import { Link, useLocation } from "wouter";
import { LogOut, User, ShoppingBag, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuthStore } from "@/store/authStore";

export function AccountLayout({ children, activeTab }: { children: React.ReactNode, activeTab: string }) {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuthStore();

  React.useEffect(() => {
    // If not logged in, redirect to auth page
    if (!user) {
      setLocation("/compte");
    }
  }, [user, setLocation]);

  const handleLogout = () => {
    setUser(null);
    setLocation("/");
  };

  if (!user) return null; // Avoid flicker

  const tabs = [
    { id: "profil", label: "Mon Profil", icon: User, path: "/compte/profil" },
    { id: "commandes", label: "Mes Commandes", icon: ShoppingBag, path: "/compte/commandes" },
    { id: "favoris", label: "Mes Favoris", icon: Heart, path: "/compte/favoris" },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 py-12 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground">Bonjour, {user?.displayName || "Client"}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Link 
                    key={tab.id} 
                    href={tab.path}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-secondary/10 text-secondary border-l-2 border-secondary' : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent'}`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </Link>
                );
              })}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-destructive border-l-2 border-transparent transition-colors mt-4"
              >
                <LogOut size={18} />
                Se déconnecter
              </button>
            </nav>
          </aside>

          <main className="flex-1">
            {children}
          </main>
          
        </div>
      </div>
    </Layout>
  );
}
