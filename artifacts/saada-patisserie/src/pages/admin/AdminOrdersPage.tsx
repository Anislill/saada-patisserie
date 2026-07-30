import * as React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-foreground">Commandes</h1>
      </div>

      <div className="bg-background border border-border rounded-sm overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>Page de gestion des commandes en construction.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
