import * as React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArrowUpRight, ShoppingBag, Users, Euro, Package } from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/firestore";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Chiffre d'Affaires", value: "14 250 €", icon: Euro, trend: "+12%" },
    { label: "Commandes (Mois)", value: "156", icon: ShoppingBag, trend: "+5%" },
    { label: "Nouveaux Clients", value: "48", icon: Users, trend: "+18%" },
    { label: "Produits Actifs", value: SEED_PRODUCTS.length.toString(), icon: Package, trend: "0%" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-serif mb-8 text-foreground">Tableau de Bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-background border border-border p-6 rounded-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary/10 text-secondary rounded-sm">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-serif">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-background border border-border rounded-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-serif">Dernières Commandes</h2>
          <button className="text-sm text-secondary hover:underline flex items-center">
            Voir tout <ArrowUpRight size={14} className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Commande</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "CMD123456", name: "Sophie Martin", date: "Aujourd'hui", status: "Nouveau", total: "120.00" },
                { id: "CMD123455", name: "Jean Dupont", date: "Hier", status: "En préparation", total: "85.00" },
                { id: "CMD123454", name: "Amira Benali", date: "Hier", status: "Expédié", total: "210.00" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-medium">{row.id}</td>
                  <td className="px-6 py-4">{row.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 text-xs rounded-sm">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{row.total} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
