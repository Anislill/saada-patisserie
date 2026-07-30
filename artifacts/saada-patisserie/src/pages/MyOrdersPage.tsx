import * as React from "react";
import { Link } from "wouter";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MyOrdersPage() {
  const orders = [
    { id: "CMD049281", date: "12 Octobre 2023", total: 125.00, status: "Livrée", itemsCount: 3 },
    { id: "CMD038192", date: "4 Septembre 2023", total: 85.00, status: "Livrée", itemsCount: 1 },
  ];

  return (
    <AccountLayout activeTab="commandes">
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-serif mb-8">Historique des commandes</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border border-border">
            <p className="text-muted-foreground mb-4">Vous n'avez pas encore passé de commande.</p>
            <Link href="/boutique"><Button>Découvrir la boutique</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-secondary transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-lg font-medium">{order.id}</h3>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Passée le {order.date}</p>
                  <p className="text-sm text-muted-foreground">{order.itemsCount} article{order.itemsCount > 1 ? 's' : ''} • Total: {order.total.toFixed(2)} €</p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/suivi-commande?id=${order.id}`}>
                    <Button variant="outline" size="sm">Suivre</Button>
                  </Link>
                  <Button variant="secondary" size="sm">Facture</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
