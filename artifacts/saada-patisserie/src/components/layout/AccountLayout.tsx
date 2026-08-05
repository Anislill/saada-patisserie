import * as React from "react";
import { Link, useLocation } from "wouter";
import { LogOut, User, ShoppingBag, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuthStore } from "@/store/authStore";

/* Thin gold ornament — same motif as the auth page */
function GoldOrnament() {
  return (
    <svg width="80" height="10" viewBox="0 0 80 10" fill="none" aria-hidden>
      <line x1="0" y1="5" x2="30" y2="5" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="40" cy="5" r="3" stroke="#C9A867" strokeWidth="0.75" />
      <circle cx="40" cy="5" r="1.2" fill="#C9A867" />
      <line x1="50" y1="5" x2="80" y2="5" stroke="#C9A867" strokeWidth="0.75" />
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
    { id: "profil",    label: "Mon Profil",      icon: User,        path: "/compte/profil" },
    { id: "commandes", label: "Mes Commandes",    icon: ShoppingBag, path: "/compte/commandes" },
    { id: "favoris",   label: "Mes Favoris",      icon: Heart,       path: "/compte/favoris" },
  ];

  const firstName = user?.displayName?.split(" ")[0] || "Client";

  return (
    <Layout>
      {/* ── Luxury masthead ─────────────────────────────────── */}
      <div className="relative bg-primary overflow-hidden">
        {/* Diagonal texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #C9A867 0px, #C9A867 1px,
              transparent 1px, transparent 14px
            )`,
          }}
        />

        {/* Corner marks */}
        <div className="absolute top-5 left-6 w-8 h-8 border-t border-l border-secondary/30" />
        <div className="absolute top-5 right-6 w-8 h-8 border-t border-r border-secondary/30" />
        <div className="absolute bottom-5 left-6 w-8 h-8 border-b border-l border-secondary/30" />
        <div className="absolute bottom-5 right-6 w-8 h-8 border-b border-r border-secondary/30" />

        <div className="relative container mx-auto px-8 md:px-12 py-10 md:py-14 text-center">
          {/* Label */}
          <p className="text-secondary/70 text-[10px] font-sans tracking-[0.4em] uppercase mb-4">
            Mon Espace Personnel
          </p>

          {/* Name */}
          <h1 className="text-primary-foreground font-serif text-3xl md:text-5xl leading-tight mb-5">
            Bonjour,&nbsp;
            <span className="italic text-secondary">{firstName}</span>
          </h1>

          {/* Ornament */}
          <div className="flex justify-center">
            <GoldOrnament />
          </div>

          {/* Email — subtle */}
          {user?.email && (
            <p className="text-primary-foreground/40 text-xs font-sans tracking-wide mt-4">
              {user.email}
            </p>
          )}
        </div>

        {/* Bottom gold hairline */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-secondary/25" />
      </div>

      {/* ── Page body ───────────────────────────────────────── */}
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
