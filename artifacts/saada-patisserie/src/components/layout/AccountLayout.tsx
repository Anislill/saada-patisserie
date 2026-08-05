import * as React from "react";
import { Link, useLocation } from "wouter";
import { LogOut, User, ShoppingBag, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuthStore } from "@/store/authStore";

function GoldOrnament() {
  return (
    <svg width="64" height="8" viewBox="0 0 64 8" fill="none" aria-hidden>
      <line x1="0" y1="4" x2="22" y2="4" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="32" cy="4" r="2.8" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="32" cy="4" r="1.1" fill="#C9A867" />
      <line x1="42" y1="4" x2="64" y2="4" stroke="#C9A867" strokeWidth="0.75" />
    </svg>
  );
}

export function AccountLayout({
  children,
  activeTab,
}: {
  children: React.ReactNode;
  activeTab: string;
}) {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuthStore();

  React.useEffect(() => {
    if (!user) setLocation("/compte");
  }, [user, setLocation]);

  const handleLogout = () => {
    setUser(null);
    setLocation("/");
  };

  if (!user) return null;

  const tabs = [
    { id: "profil",    label: "Mon Profil",   icon: User,        path: "/compte/profil" },
    { id: "commandes", label: "Mes Commandes", icon: ShoppingBag, path: "/compte/commandes" },
    { id: "favoris",   label: "Mes Favoris",   icon: Heart,       path: "/compte/favoris" },
  ];

  const firstName = user?.displayName?.split(" ")[0] || "Client";

  return (
    <Layout>
      {/* ── Masthead — compact & refined ── */}
      <div className="relative bg-primary overflow-hidden">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg,#C9A867 0px,#C9A867 1px,transparent 1px,transparent 14px)`,
          }}
        />

        {/* Corner marks — smaller */}
        <div className="absolute top-4 left-5 w-5 h-5 border-t border-l border-secondary/25" />
        <div className="absolute top-4 right-5 w-5 h-5 border-t border-r border-secondary/25" />
        <div className="absolute bottom-4 left-5 w-5 h-5 border-b border-l border-secondary/25" />
        <div className="absolute bottom-4 right-5 w-5 h-5 border-b border-r border-secondary/25" />

        <div className="relative container mx-auto px-8 md:px-12 py-6 md:py-8 text-center">
          <p className="text-secondary/55 text-[9px] font-sans tracking-[0.45em] uppercase mb-3">
            Mon Espace Personnel
          </p>
          <h1 className="text-primary-foreground font-serif text-2xl md:text-3xl leading-tight mb-3">
            Bonjour,&nbsp;
            <span className="italic text-secondary">{firstName}</span>
          </h1>
          <div className="flex justify-center mb-3">
            <GoldOrnament />
          </div>
          {user?.email && (
            <p className="text-primary-foreground/35 text-[11px] font-sans tracking-wide">
              {user.email}
            </p>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-secondary/20" />
      </div>

      {/* ── Page body ── */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-10">

          {/* Sidebar */}
          <aside className="w-full md:w-52 shrink-0">
            <nav className="flex flex-col">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.path}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all mb-0.5 ${
                      isActive
                        ? "text-secondary border-l-2 border-secondary pl-3"
                        : "text-muted-foreground border-l-2 border-transparent hover:text-foreground hover:border-border"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </Link>
                );
              })}

              <div className="border-t border-border mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground border-l-2 border-transparent hover:text-red-600 hover:border-red-300 transition-all"
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </Layout>
  );
}
