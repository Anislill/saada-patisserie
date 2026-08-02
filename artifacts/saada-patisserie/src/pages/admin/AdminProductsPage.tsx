import * as React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProductStore } from "@/store/productStore";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const products = useProductStore((s) => s.products);
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif text-foreground">Produits</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus size={18} className="mr-2" /> Ajouter un produit
        </Button>
      </div>

      <div className="bg-background border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted overflow-hidden border border-border">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.categories[0]}</td>
                  <td className="px-6 py-4">{product.price} €</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-sm border ${product.isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {product.isAvailable ? 'En ligne' : 'Rupture'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={16} /></button>
                      <button className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
