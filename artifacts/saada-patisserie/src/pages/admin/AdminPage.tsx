import * as React from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";
import {
  SEED_CATEGORIES, Product, PricingUnit, Coupon,
  uploadBase64ToStorage, uploadFileToStorage,
} from "@/lib/firestore";
import { useProductStore } from "@/store/productStore";
import { usePromoStore } from "@/store/promoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, ShoppingBag, PackageSearch, Users,
  Ticket, Settings, LogOut, Plus, Edit2, Trash2,
  X, Menu, ChevronRight, Eye, EyeOff, Tag, Store,
  AlertCircle, Image
} from "lucide-react";
import logoPath from "@assets/0_file_00000000873481f494288e53319f68ef-removebg-preview_1785313194757.png";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";

/* ─────────────────────────── types ─────────────────────────── */
type Tab = "dashboard" | "produits" | "commandes" | "clients" | "promotions" | "contenu" | "parametres";


/* ─────────────────────── empty-state banner ─────────────────── */
function FirebaseBanner() {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-sm mb-6 text-sm">
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span>
        Connectez Firebase pour voir les vraies statistiques, commandes et clients en temps réel.
        Les données affichées ici sont les données initiales du catalogue.
      </span>
    </div>
  );
}

/* ─────────────────────── stat card ─────────────────────── */
function StatCard({ label, value, sub, icon: Icon, color = "text-secondary" }: {
  label: string; value: string; sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color?: string;
}) {
  return (
    <div className="bg-background border border-border p-6 rounded-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 bg-secondary/10 rounded-sm ${color}`}><Icon size={20} /></div>
        {sub && <span className="text-xs font-medium text-muted-foreground">{sub}</span>}
      </div>
      <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-serif">{value}</p>
    </div>
  );
}

/* ─────────────────── DASHBOARD TAB ─────────────────── */
function DashboardTab() {
  const products = useProductStore((s) => s.products);
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Tableau de Bord</h2>
      <FirebaseBanner />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Chiffre d'Affaires" value="0 €" sub="Ce mois" icon={Tag} />
        <StatCard label="Commandes" value="0" sub="Ce mois" icon={ShoppingBag} />
        <StatCard label="Nouveaux Clients" value="0" sub="Ce mois" icon={Users} />
        <StatCard label="Produits Actifs" value={products.filter(p => p.isAvailable).length.toString()} icon={PackageSearch} />
      </div>
      {/* recent orders */}
      <div className="bg-background border border-border rounded-sm overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-serif text-lg">Dernières Commandes</h3>
        </div>
        <div className="p-10 text-center text-muted-foreground text-sm">
          <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
          <p>Aucune commande pour l'instant.</p>
          <p className="mt-1 text-xs">Les commandes apparaîtront ici une fois Firebase connecté.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Image helpers ── */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 900;
      const r = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * r);
      canvas.height = Math.round(img.height * r);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    img.src = objectUrl;
  });
}
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─────────────────── PRODUCTS TAB ─────────────────── */
function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability } = useProductStore();
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState<Partial<Product>>({ isAvailable: true, categories: [], flavors: [], images: [], pricingUnit: 'piece' });
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ isAvailable: true, categories: [], flavors: [], images: [], pricingUnit: 'piece' });
    setShowForm(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setShowForm(true);
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const base64 = await compressImage(file);
          const path = `products/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '-')}`;
          return uploadBase64ToStorage(base64, path);
        })
      );
      setForm(f => ({ ...f, images: [...(f.images ?? []), ...urls] }));
    } catch (err) {
      console.error('Image upload error:', err);
      alert("Erreur lors du téléchargement de l'image. Vérifiez Firebase Storage.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx: number) =>
    setForm(f => ({ ...f, images: (f.images ?? []).filter((_, i) => i !== idx) }));

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("La vidéo doit faire moins de 50 Mo.");
      return;
    }
    setUploading(true);
    try {
      const path = `products/videos/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '-')}`;
      const url = await uploadFileToStorage(file, path);
      setForm(f => ({ ...f, video: url }));
    } catch (err) {
      console.error('Video upload error:', err);
      alert("Erreur lors du téléchargement de la vidéo. Vérifiez Firebase Storage.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) return;
    const saved: Product = {
      id: editing?.id ?? `p${Date.now()}`,
      slug: editing?.slug ?? (form.name ?? "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      name: form.name ?? "",
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
      description: form.description ?? "",
      shortDescription: form.shortDescription ?? "",
      categories: form.categories ?? [],
      flavors: form.flavors ?? [],
      images: form.images ?? [],
      isAvailable: form.isAvailable ?? true,
      isBestSeller: form.isBestSeller ?? false,
      isFeatured: form.isFeatured ?? false,
      pricingUnit: form.pricingUnit,
      video: form.video,
    };
    setSaving(true);
    try {
      if (editing) await updateProduct(saved);
      else await addProduct(saved);
      setShowForm(false);
    } catch (err) {
      console.error('Save product error:', err);
      alert("Erreur lors de la sauvegarde. Vérifiez votre connexion Firebase.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-serif">Produits <span className="text-base text-muted-foreground font-sans">({products.length})</span></h2>
        <Button onClick={openAdd} className="bg-secondary text-white hover:bg-secondary/90 rounded-sm">
          <Plus size={16} className="mr-2" /> Ajouter un produit
        </Button>
      </div>

      <div className="bg-background border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3">Produit</th>
                <th className="px-5 py-3 hidden md:table-cell">Catégorie</th>
                <th className="px-5 py-3">Prix</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <div className="w-9 h-9 shrink-0 overflow-hidden border border-border rounded-sm bg-muted">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {product.categories.filter(c => !["bestsellers","featured"].includes(c))[0] ?? "—"}
                  </td>
                  <td className="px-5 py-3 font-medium">
                    {product.price} د.ت
                    {product.pricingUnit && product.pricingUnit !== 'piece' && (
                      <span className="text-xs text-muted-foreground ml-1">/ {product.pricingUnit}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => { toggleAvailability(product.id).catch(console.error); }}
                      className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-sm border transition-colors ${product.isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}>
                      {product.isAvailable ? <Eye size={11} /> : <EyeOff size={11} />}
                      {product.isAvailable ? 'En ligne' : 'Masqué'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-sm transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => { if (confirm("Supprimer ce produit ?")) deleteProduct(product.id).catch(console.error); }} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-sm transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-serif text-xl">{editing ? "Modifier le produit" : "Nouveau produit"}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">

              {/* Name */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Nom du produit *</label>
                <Input value={form.name ?? ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Prix (د.ت) *</label>
                  <Input type="number" min="0" value={form.price ?? ""} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Prix promo (د.ت)</label>
                  <Input type="number" min="0" value={form.discountedPrice ?? ""} onChange={e => setForm(f => ({ ...f, discountedPrice: e.target.value ? Number(e.target.value) : undefined }))} />
                </div>
              </div>

              {/* Pricing unit */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Unité de vente</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'piece', label: 'À la pièce' },
                    { value: '100g',  label: 'Par 100g'   },
                    { value: 'kg',    label: 'Au kg'      },
                  ] as { value: PricingUnit; label: string }[]).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, pricingUnit: opt.value }))}
                      className={`p-3 border rounded-sm text-sm font-medium text-center transition-colors ${
                        (form.pricingUnit ?? 'piece') === opt.value
                          ? 'border-secondary bg-secondary/5 text-secondary'
                          : 'border-border hover:border-secondary/50 text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short desc */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Description courte</label>
                <Input value={form.shortDescription ?? ""} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
              </div>

              {/* Full desc */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Description complète</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-input bg-background rounded-sm px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Catégories <span className="text-muted-foreground font-normal">(séparées par des virgules)</span></label>
                <Input
                  value={(form.categories ?? []).join(", ")}
                  onChange={e => setForm(f => ({ ...f, categories: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                />
              </div>

              {/* Flavors */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Saveurs <span className="text-muted-foreground font-normal">(séparées par des virgules)</span></label>
                <Input
                  value={(form.flavors ?? []).join(", ")}
                  onChange={e => setForm(f => ({ ...f, flavors: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                />
              </div>

              {/* ── Images upload ── */}
              <div>
                <label className="text-sm font-medium block mb-2">Photos du produit</label>
                <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-sm py-4 cursor-pointer hover:border-secondary/60 transition-colors text-sm text-muted-foreground ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Image size={16} />
                  {uploading ? "Compression en cours…" : "Cliquer pour ajouter des photos"}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagesUpload} disabled={uploading} />
                </label>
                {(form.images ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(form.images ?? []).map((src, i) => (
                      <div key={i} className="relative group w-20 h-20 rounded-sm overflow-hidden border border-border bg-muted">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Video upload ── */}
              <div>
                <label className="text-sm font-medium block mb-2">Vidéo courte <span className="text-muted-foreground font-normal text-xs">(max 30 Mo)</span></label>
                <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-sm py-4 cursor-pointer hover:border-secondary/60 transition-colors text-sm text-muted-foreground ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ShoppingBag size={16} />
                  {uploading ? "Chargement…" : form.video ? "Remplacer la vidéo" : "Cliquer pour ajouter une vidéo"}
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploading} />
                </label>
                {form.video && (
                  <div className="mt-3 relative rounded-sm overflow-hidden border border-border bg-muted">
                    <video src={form.video} controls className="w-full max-h-40 object-contain" />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, video: undefined }))}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable ?? true}
                    onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
                    className="w-4 h-4 accent-secondary" />
                  <span className="text-sm font-medium">Produit visible sur la boutique</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isBestSeller ?? false}
                    onChange={e => setForm(f => ({ ...f, isBestSeller: e.target.checked }))}
                    className="w-4 h-4 accent-secondary" />
                  <span className="text-sm font-medium">Meilleure vente</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured ?? false}
                    onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-secondary" />
                  <span className="text-sm font-medium">Mis en avant (homepage)</span>
                </label>
              </div>

            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-sm">Annuler</Button>
              <Button onClick={saveProduct} disabled={uploading || saving} className="bg-secondary text-white hover:bg-secondary/90 rounded-sm">
                {saving ? "Sauvegarde…" : editing ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── ORDERS TAB ─────────────────── */
function OrdersTab() {
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Commandes</h2>
      <div className="bg-background border border-border rounded-sm overflow-hidden">
        <div className="p-10 text-center text-muted-foreground text-sm">
          <ShoppingBag size={40} className="mx-auto mb-4 opacity-25" />
          <p className="font-medium text-base text-foreground/60">Aucune commande</p>
          <p className="mt-2 max-w-xs mx-auto">Les commandes passées par vos clients apparaîtront ici une fois Firebase connecté.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── CLIENTS TAB ─────────────────── */
function ClientsTab() {
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Clients</h2>
      <div className="bg-background border border-border rounded-sm overflow-hidden">
        <div className="p-10 text-center text-muted-foreground text-sm">
          <Users size={40} className="mx-auto mb-4 opacity-25" />
          <p className="font-medium text-base text-foreground/60">Aucun client enregistré</p>
          <p className="mt-2 max-w-xs mx-auto">La liste des clients s'alimentera automatiquement lorsque des comptes seront créés sur la boutique.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── PROMOTIONS TAB ─────────────────── */
function PromotionsTab() {
  const { coupons, addCoupon, deleteCoupon, toggleCoupon } = usePromoStore();
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState<Partial<Coupon>>({ active: true, discount: 10, minOrder: 0 });

  const [couponSaving, setCouponSaving] = React.useState(false);
  const [couponError, setCouponError] = React.useState<string | null>(null);

  const saveCoupon = async () => {
    if (!form.code || !form.discount) return;
    setCouponSaving(true);
    setCouponError(null);
    try {
      await addCoupon({
        code: (form.code ?? "").toUpperCase(),
        discount: Number(form.discount),
        minOrder: Number(form.minOrder ?? 0),
        expiry: form.expiry ?? "",
        active: form.active ?? true,
      });
      setForm({ active: true, discount: 10, minOrder: 0 });
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setCouponError(`Erreur: ${msg}`);
      console.error("saveCoupon error:", err);
    } finally {
      setCouponSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-serif">Promotions & Coupons</h2>
        <Button onClick={() => setShowForm(true)} className="bg-secondary text-white hover:bg-secondary/90 rounded-sm">
          <Plus size={16} className="mr-2" /> Créer un coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-background border border-border rounded-sm p-10 text-center text-muted-foreground text-sm">
          <Ticket size={40} className="mx-auto mb-4 opacity-25" />
          <p className="font-medium text-base text-foreground/60">Aucun coupon</p>
          <p className="mt-2">Créez des codes promo pour fidéliser vos clients.</p>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Réduction</th>
                <th className="px-5 py-3 hidden sm:table-cell">Commande min.</th>
                <th className="px-5 py-3 hidden md:table-cell">Expiration</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-5 py-3 font-mono font-bold text-secondary">{c.code}</td>
                  <td className="px-5 py-3">{c.discount}%</td>
                  <td className="px-5 py-3 hidden sm:table-cell">{c.minOrder > 0 ? `${c.minOrder} د.ت` : "—"}</td>
                  <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">{c.expiry || "—"}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleCoupon(c.id, !c.active)}
                      className={`px-2 py-1 text-xs rounded-sm border ${c.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-muted text-muted-foreground border-border'}`}>
                      {c.active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-sm transition-colors"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupon Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-sm w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-serif text-xl">Nouveau coupon</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Code promo *</label>
                <Input value={form.code ?? ""} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="ETE2025" className="font-mono uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Réduction (%) *</label>
                  <Input type="number" min={1} max={100} value={form.discount ?? ""} onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))} placeholder="10" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Commande min. (€)</label>
                  <Input type="number" min={0} value={form.minOrder ?? ""} onChange={e => setForm(f => ({ ...f, minOrder: Number(e.target.value) }))} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Date d'expiration</label>
                <Input type="date" value={form.expiry ?? ""} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="couponActive" checked={form.active ?? true}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 accent-secondary" />
                <label htmlFor="couponActive" className="text-sm font-medium cursor-pointer">Activer immédiatement</label>
              </div>
            </div>
            {couponError && (
              <p className="px-6 pb-2 text-sm text-destructive">{couponError}</p>
            )}
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={couponSaving} className="rounded-sm">Annuler</Button>
              <Button onClick={saveCoupon} disabled={couponSaving} className="bg-secondary text-white hover:bg-secondary/90 rounded-sm">
                {couponSaving ? "Sauvegarde…" : "Créer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── CONTENU TAB ─────────────────── */
function ContenuTab() {
  const { settings, updateSettings, saveSettings } = useSiteSettingsStore();
  const [inputUrl, setInputUrl] = React.useState(settings.heroImageUrl ?? "");
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [previewError, setPreviewError] = React.useState(false);

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      updateSettings({ heroImageUrl: inputUrl.trim() });
      await saveSettings();
      setSaved(true);
      setPreviewError(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError("Erreur de sauvegarde. Vérifiez les règles Firebase.");
      console.error("ContenuTab save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setInputUrl("");
    setSaving(true);
    setSaveError(null);
    try {
      updateSettings({ heroImageUrl: "" });
      await saveSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError("Erreur de sauvegarde. Vérifiez les règles Firebase.");
      console.error("ContenuTab reset error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Contenu de la boutique</h2>

      {/* Hero Image Section */}
      <section className="bg-background border border-border rounded-sm p-6 space-y-5">
        <h3 className="font-serif text-lg pb-3 border-b border-border flex items-center gap-2">
          <Image size={18} /> Image héro de la page d'accueil
        </h3>

        <p className="text-sm text-muted-foreground">
          Collez l'URL directe d'une image (JPG, PNG, WebP) ou une URL Firebase Storage.
          Laissez vide pour utiliser l'image par défaut.
        </p>

        <div className="space-y-3">
          <label className="text-sm font-medium block">URL de l'image héro</label>
          <div className="flex gap-3">
            <Input
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://..."
              className="flex-1 font-mono text-xs"
            />
            <Button
              onClick={save}
              disabled={saving}
              className="bg-secondary text-white hover:bg-secondary/90 rounded-sm shrink-0"
            >
              {saving ? "Sauvegarde…" : saved ? "✓ Enregistré" : "Appliquer"}
            </Button>
          </div>
          {saveError && (
            <p className="text-sm text-destructive mt-2">{saveError}</p>
          )}
          {inputUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-muted-foreground text-xs h-7 px-2"
            >
              Réinitialiser (image par défaut)
            </Button>
          )}
        </div>

        {/* Preview */}
        {(inputUrl || settings.heroImageUrl) && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-sans">Aperçu</p>
            {previewError ? (
              <div className="w-full h-48 bg-muted/40 border border-border flex items-center justify-center text-sm text-muted-foreground rounded-sm">
                Image non chargée — vérifiez l'URL
              </div>
            ) : (
              <div className="relative w-full aspect-[16/7] overflow-hidden rounded-sm border border-border">
                <img
                  src={inputUrl || settings.heroImageUrl}
                  alt="Aperçu héro"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewError(true)}
                  onLoad={() => setPreviewError(false)}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-serif text-xl opacity-60">Aperçu héro</span>
                </div>
              </div>
            )}
          </div>
        )}

        {!inputUrl && !settings.heroImageUrl && (
          <div className="w-full h-32 bg-muted/30 border border-dashed border-border rounded-sm flex items-center justify-center text-sm text-muted-foreground">
            Image par défaut active — collez une URL pour la remplacer
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────────────── SETTINGS TAB ─────────────────── */
function SettingsTab() {
  const { settings, isLoading, isSaving, updateSettings, saveSettings } = useSiteSettingsStore();
  const [savedFeedback, setSavedFeedback] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const save = async () => {
    setSaveError(null);
    try {
      await saveSettings();
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setSaveError(`Erreur de sauvegarde : ${msg}`);
      console.error("SettingsTab save error:", err);
    }
  };

  type SettingsKey = keyof typeof settings;
  const field = (label: string, key: SettingsKey, type = "text", placeholder = "") => (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <Input
        type={type}
        value={settings[key] as string}
        onChange={e => updateSettings({ [key]: e.target.value })}
        placeholder={placeholder}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-serif">Paramètres du magasin</h2>
        <Button onClick={save} disabled={isSaving} className="bg-secondary text-white hover:bg-secondary/90 rounded-sm">
          {isSaving ? "Enregistrement…" : savedFeedback ? "✓ Enregistré" : "Enregistrer"}
        </Button>
      </div>
      {saveError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Informations */}
        <section className="bg-background border border-border rounded-sm p-6">
          <h3 className="font-serif text-lg mb-5 pb-3 border-b border-border flex items-center gap-2"><Store size={18} /> Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field("Nom de la boutique", "storeName")}
            {field("Email de contact", "email", "email")}
            {field("Téléphone", "phone", "tel", "+33 6 00 00 00 00")}
            {field("Adresse", "address", "text", "12 rue de la Paix")}
            {field("Ville", "city", "text", "Paris")}
            <div>
              <label className="text-sm font-medium block mb-1.5">Devise</label>
              <select
                value={settings.currency}
                onChange={e => updateSettings({ currency: e.target.value })}
                className="w-full border border-input bg-background rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="EUR">EUR — Euro (€)</option>
                <option value="MAD">MAD — Dirham marocain (د.م.)</option>
                <option value="DZD">DZD — Dinar algérien (د.ج)</option>
                <option value="TND">TND — Dinar tunisien (د.ت)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Livraison */}
        <section className="bg-background border border-border rounded-sm p-6">
          <h3 className="font-serif text-lg mb-5 pb-3 border-b border-border">Livraison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field("Frais de livraison (€)", "deliveryFee", "number")}
            {field("Livraison gratuite à partir de (€)", "freeDeliveryFrom", "number")}
          </div>
        </section>

        {/* Barre d'annonce */}
        <section className="bg-background border border-border rounded-sm p-6">
          <h3 className="font-serif text-lg mb-5 pb-3 border-b border-border">Barre d'annonce</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="annActive" checked={settings.announcementActive}
                onChange={e => updateSettings({ announcementActive: e.target.checked })}
                className="w-4 h-4 accent-secondary" />
              <label htmlFor="annActive" className="text-sm font-medium cursor-pointer">Afficher la barre d'annonce</label>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Texte de l'annonce</label>
              <Input value={settings.announcementBar}
                onChange={e => updateSettings({ announcementBar: e.target.value })}
                placeholder="Livraison gratuite à partir de 100€..." />
            </div>
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section className="bg-background border border-border rounded-sm p-6">
          <h3 className="font-serif text-lg mb-5 pb-3 border-b border-border">Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {field("Instagram", "instagram", "url", "https://instagram.com/saada")}
            {field("Facebook", "facebook", "url", "https://facebook.com/saada")}
            {field("WhatsApp", "whatsapp", "tel", "+33600000000")}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
const TABS: { id: Tab; label: string; shortLabel: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "dashboard",   label: "Tableau de Bord",   shortLabel: "Accueil",  icon: LayoutDashboard },
  { id: "produits",    label: "Produits",            shortLabel: "Produits", icon: PackageSearch },
  { id: "commandes",   label: "Commandes",           shortLabel: "Commandes",icon: ShoppingBag },
  { id: "clients",     label: "Clients",             shortLabel: "Clients",  icon: Users },
  { id: "promotions",  label: "Promotions",          shortLabel: "Promos",   icon: Ticket },
  { id: "contenu",     label: "Contenu",             shortLabel: "Contenu",  icon: Image },
  { id: "parametres",  label: "Paramètres",          shortLabel: "Réglages", icon: Settings },
];

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Auth guard
  React.useEffect(() => {
    if (!user) setLocation("/admin");
  }, [user, setLocation]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground text-sm">Redirection…</div>
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    setLocation("/admin");
  };

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#F5F5F4] font-sans">
      {/* ── Desktop Sidebar ── */}
      <aside className="w-60 bg-[#111111] text-white hidden lg:flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <img src={logoPath} alt="Saada" className="h-8 w-8 object-contain filter invert" />
          <span className="font-serif text-lg text-[#C9A867]">Admin</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => selectTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left ${active ? 'bg-[#C9A867] text-black font-semibold' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/60 hover:bg-white/10 hover:text-red-400 transition-colors">
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Mobile Overlay Sidebar ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#111111] text-white flex flex-col">
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <span className="font-serif text-lg text-[#C9A867]">Saada Admin</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-white/60 hover:text-white"><X size={20} /></button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => selectTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left ${active ? 'bg-[#C9A867] text-black font-semibold' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}>
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-white/10">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/60 hover:bg-white/10 hover:text-red-400 transition-colors">
                <LogOut size={16} />Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="bg-white border-b border-border h-14 flex items-center justify-between px-4 lg:hidden sticky top-0 z-40">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-1 text-muted-foreground hover:text-foreground">
            <Menu size={22} />
          </button>
          <span className="font-serif text-base">Saada Admin</span>
          <button onClick={handleLogout} className="p-1 text-muted-foreground hover:text-red-500"><LogOut size={18} /></button>
        </header>

        {/* Desktop Top Bar */}
        <header className="bg-white border-b border-border h-14 hidden lg:flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{TABS.find(t => t.id === activeTab)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-sm px-3 py-1.5 transition-colors">
              Voir la boutique ↗
            </a>
            <span className="text-sm text-muted-foreground">{user.email ?? "Admin"}</span>
          </div>
        </header>

        {/* Mobile Bottom Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border flex">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => selectTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 text-[10px] gap-0.5 transition-colors ${active ? 'text-[#1F3D2E] font-semibold' : 'text-muted-foreground'}`}>
                <Icon size={18} />
                {tab.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {activeTab === "dashboard"  && <DashboardTab />}
          {activeTab === "produits"   && <ProductsTab />}
          {activeTab === "commandes"  && <OrdersTab />}
          {activeTab === "clients"    && <ClientsTab />}
          {activeTab === "promotions" && <PromotionsTab />}
          {activeTab === "contenu"    && <ContenuTab />}
          {activeTab === "parametres" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
