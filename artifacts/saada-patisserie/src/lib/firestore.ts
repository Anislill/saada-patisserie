import {
  collection, doc, setDoc, deleteDoc, onSnapshot,
  getDocs, getDoc, query, where, orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// ─────────────────── Cloudinary config ──────────────────
const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

import productArabesque from "@assets/generated_images/product-arabesque.jpg";
import productSignature from "@assets/generated_images/product-signature.jpg";
import productPistache from "@assets/generated_images/product-pistache.jpg";
import productNoisette from "@assets/generated_images/product-noisette.jpg";
import productFamille from "@assets/generated_images/product-famille.jpg";
import productRose from "@assets/generated_images/product-rose.jpg";
import productAnniversaire from "@assets/generated_images/product-anniversaire.jpg";
import productMignardises from "@assets/generated_images/product-mignardises.jpg";

/** How the price is charged — set per-product in the admin */
export type PricingUnit = 'piece' | '100g' | 'kg';

/** Price label next to the amount: "" (piece), "/ 100g", "/ kg" */
export function getPriceUnitLabel(unit?: PricingUnit): string {
  if (unit === '100g') return '/ 100g';
  if (unit === 'kg') return '/ kg';
  return '';
}

/** What to show in the qty counter: "1" → "1" (piece) | "100g" | "1 kg" */
export function getQtyDisplay(qty: number, unit?: PricingUnit): string {
  if (unit === '100g') return `${qty * 100} g`;
  if (unit === 'kg') return `${qty} kg`;
  return `${qty}`;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  description: string;
  shortDescription: string;
  categories: string[];
  flavors: string[];
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isAvailable: boolean;
  pricingUnit?: PricingUnit;
  video?: string;
  variants?: { size?: string[]; flavor?: string[] };
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "coffret-arabesque",
    name: "Coffret Arabesque",
    price: 85,
    description: "Assortiment luxueux de pâtisseries orientales aux amandes et pistaches, délicatement parfumé à l'eau de fleur d'oranger et de rose. Une véritable invitation au voyage.",
    shortDescription: "Assortiment de pâtisseries orientales aux amandes et pistaches",
    categories: ["Coffrets Gourmands", "bestsellers"],
    flavors: ["Amande", "Pistache"],
    images: [productArabesque],
    isBestSeller: true,
    isAvailable: true,
  },
  {
    id: "p2",
    slug: "coffret-signature-saada",
    name: "Coffret Signature Saada",
    price: 120,
    description: "Notre sélection prestige. Les créations les plus emblématiques de Saada réunies dans un écrin élégant. Parfait pour les grandes occasions ou un cadeau mémorable.",
    shortDescription: "Notre sélection prestige",
    categories: ["Coffrets Gourmands", "bestsellers", "featured"],
    flavors: ["Amande", "Pistache", "Noisette", "Rose"],
    images: [productSignature],
    isFeatured: true,
    isBestSeller: true,
    isAvailable: true,
  },
  {
    id: "p3",
    slug: "boite-delice-pistache",
    name: "Boîte Délice Pistache",
    price: 65,
    description: "Feuilletés artisanaux garnis de pistaches d'Iran torréfiées. Croustillant incomparable et douceur subtile.",
    shortDescription: "Feuilletés aux pistaches d'Iran",
    categories: ["Coffrets Gourmands"],
    flavors: ["Pistache"],
    images: [productPistache],
    isAvailable: true,
  },
  {
    id: "p4",
    slug: "assortiment-noisette-caramel",
    name: "Assortiment Noisette & Caramel",
    price: 75,
    description: "Douceurs au praliné maison, éclats de noisettes torréfiées et caramel au beurre salé. Une harmonie parfaite pour les gourmands.",
    shortDescription: "Douceurs au praliné maison",
    categories: ["Coffrets Gourmands"],
    flavors: ["Noisette", "Caramel"],
    images: [productNoisette],
    isAvailable: true,
  },
  {
    id: "p5",
    slug: "pack-famille-gourmand",
    name: "Pack Famille Gourmand",
    price: 95,
    description: "Un grand coffret pensé pour partager. Une sélection variée pour satisfaire tous les goûts lors de vos réunions de famille.",
    shortDescription: "Grand coffret pour partager",
    categories: ["Coffrets Gourmands", "bestsellers"],
    flavors: ["Amande", "Pistache", "Noisette"],
    images: [productFamille],
    isBestSeller: true,
    isAvailable: true,
  },
  {
    id: "p6",
    slug: "coffret-rose-framboise",
    name: "Coffret Rose & Framboise",
    price: 70,
    description: "Pâtisseries florales délicates mariant la douceur de la rose de Damas et la vivacité de la framboise fraîche.",
    shortDescription: "Pâtisseries florales délicates",
    categories: ["Coffrets Gourmands", "Collections Saisonnières"],
    flavors: ["Rose", "Framboise"],
    images: [productRose],
    isAvailable: true,
  },
  {
    id: "p7",
    slug: "boite-prestige-anniversaire",
    name: "Boîte Prestige Anniversaire",
    price: 110,
    description: "Coffret d'exception personnalisable avec message. Contient nos meilleures créations pour célébrer ce moment unique.",
    shortDescription: "Coffret personnalisable avec message",
    categories: ["Coffrets Gourmands", "featured"],
    flavors: ["Amande", "Pistache", "Caramel"],
    images: [productAnniversaire],
    isFeatured: true,
    isAvailable: true,
    variants: { size: ["Moyen", "Grand"], flavor: ["Mixte", "Tout Chocolat"] }
  },
  {
    id: "p8",
    slug: "mignardises-raffinees",
    name: "Mignardises Raffinées",
    price: 55,
    description: "Petites bouchées exquises pour accompagner le thé ou le café. Élégance et raffinement en miniature.",
    shortDescription: "Petites bouchées pour les grandes occasions",
    categories: ["Mignardises"],
    flavors: ["Amande", "Noisette"],
    images: [productMignardises],
    isAvailable: true,
  }
];

export const SEED_CATEGORIES = [
  { id: "c1", name: "Coffrets Gourmands", slug: "coffrets-gourmands" },
  { id: "c2", name: "Mignardises", slug: "mignardises" },
  { id: "c3", name: "Collections Saisonnières", slug: "collections-saisonnieres" },
  { id: "c4", name: "Cadeaux d'Entreprise", slug: "cadeaux-entreprise" }
];

export const SEED_TESTIMONIALS = [
  { id: "t1", name: "Sophie M.", rating: 5, text: "Une expérience gustative exceptionnelle. Les pâtisseries sont d'une finesse rare et le packaging est sublime." },
  { id: "t2", name: "Laurent D.", rating: 5, text: "Commandé pour un anniversaire, le coffret Prestige a fait sensation. Livraison parfaite et produits frais." },
  { id: "t3", name: "Amira B.", rating: 5, text: "Les saveurs rappellent celles de mon enfance avec une touche de modernité incroyable. Le feuilleté à la pistache est divin." },
  { id: "t4", name: "Jean-Paul V.", rating: 4, text: "Très belle découverte. Un service client réactif et des produits de très haute qualité." }
];

// ─────────────────── Cloudinary helpers ─────────────────

async function cloudinaryUpload(
  formData: FormData,
  resourceType: 'image' | 'video',
): Promise<string> {
  formData.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${resourceType}/upload`,
    { method: 'POST', body: formData },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Cloudinary ${resourceType} upload failed (${res.status})`);
  }
  const data = await res.json();
  return data.secure_url as string;
}

/** Upload a base64 data-URL image to Cloudinary, return secure URL */
export async function uploadBase64ToStorage(base64: string, _path: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', base64);
  return cloudinaryUpload(fd, 'image');
}

/** Upload a File (image or video) to Cloudinary, return secure URL */
export async function uploadFileToStorage(file: File, _path: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  return cloudinaryUpload(fd, resourceType);
}

// ─────────────────── Products ───────────────────────────

export function subscribeToProducts(
  callback: (products: Product[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, 'products'));
  return onSnapshot(
    q,
    (snap) => {
      const products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      callback(products);
    },
    (err) => onError?.(err as Error)
  );
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const { id, ...data } = product;
  // Strip undefined values — Firestore does not accept them
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  await setDoc(doc(db, 'products', id), clean);
}

export async function deleteProductFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// ─────────────────── Settings ───────────────────────────

export interface SiteSettings {
  heroImageUrl?: string;
  storeName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  deliveryFee?: string;
  freeDeliveryFrom?: string;
  currency?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  announcementBar?: string;
  announcementActive?: boolean;
}

export const DEFAULT_SETTINGS: Required<SiteSettings> = {
  heroImageUrl: '',
  storeName: 'Saada Pâtisserie',
  email: 'contact@saada-patisserie.com',
  phone: '',
  address: '',
  city: '',
  deliveryFee: '5',
  freeDeliveryFrom: '100',
  currency: 'TND',
  instagram: '',
  facebook: '',
  whatsapp: '',
  announcementBar: 'Livraison gratuite à partir de 100 د.ت d\'achats · Découvrez notre nouvelle collection',
  announcementActive: true,
};

export function subscribeToSettings(
  callback: (settings: SiteSettings) => void
): () => void {
  return onSnapshot(doc(db, 'settings', 'main'), (snap) => {
    callback(snap.exists() ? (snap.data() as SiteSettings) : {});
  });
}

export async function saveSettingsToFirestore(settings: Partial<SiteSettings>): Promise<void> {
  await setDoc(doc(db, 'settings', 'main'), settings, { merge: true });
}

// ─────────────────── Coupons ────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  minOrder: number;
  expiry: string;
  active: boolean;
}

export function subscribeToCoupons(
  callback: (coupons: Coupon[]) => void,
  onError?: (err: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'coupons'),
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon)));
    },
    (err) => onError?.(err as Error)
  );
}

export async function saveCouponToFirestore(coupon: Coupon): Promise<void> {
  const { id, ...data } = coupon;
  await setDoc(doc(db, 'coupons', id), data);
}

export async function deleteCouponFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', id));
}

export async function toggleCouponInFirestore(id: string, active: boolean): Promise<void> {
  await setDoc(doc(db, 'coupons', id), { active }, { merge: true });
}

// ─────────────────── Customer Profile ──────────────────

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
}

export async function getUserProfile(uid: string): Promise<CustomerProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as CustomerProfile;
}

export async function saveUserProfile(uid: string, profile: Partial<CustomerProfile>): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(profile).filter(([, v]) => v !== undefined && v !== null)
  );
  await setDoc(doc(db, 'users', uid), clean, { merge: true });
}

// ─────────────────── Orders ─────────────────────────────

export type OrderStatus = "En attente" | "En préparation" | "Expédiée" | "Livrée" | "Annulée";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface Order {
  orderId: string;
  userId: string | null;
  userEmail: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode: string;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    postalCode: string;
    city: string;
    instructions: string;
  };
}

export async function saveOrder(order: Order): Promise<void> {
  const { orderId, ...data } = order;
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  await setDoc(doc(db, 'orders', orderId), clean);
}

/** Fetch all orders for a given user, sorted newest-first (client-side sort avoids composite index). */
export async function getUserOrders(uid: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('userId', '==', uid));
  const snap = await getDocs(q);
  const orders = snap.docs.map((d) => ({ orderId: d.id, ...d.data() } as Order));
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Real-time listener for all orders — admin only. */
export function subscribeToAllOrders(
  callback: (orders: Order[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ orderId: d.id, ...d.data() } as Order))),
    (err) => onError?.(err as Error)
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
}

/** Real-time listener for all customer profiles — admin only. */
export function subscribeToAllClients(
  callback: (clients: (CustomerProfile & { uid: string; email?: string })[]) => void,
  onError?: (err: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'users'),
    (snap) => callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as CustomerProfile & { uid: string }))),
    (err) => onError?.(err as Error)
  );
}

// ─────────────────── Seeding ────────────────────────────

let _seedingInProgress = false;

/** Seed Firestore with initial data the very first time the app runs. */
export async function seedFirestoreIfEmpty(): Promise<void> {
  if (_seedingInProgress) return;
  _seedingInProgress = true;
  try {
    // Idempotency marker — prevents double-seeding across sessions
    const markerSnap = await getDoc(doc(db, 'settings', 'seeded'));
    if (markerSnap.exists()) return;

    // Seed products
    for (const product of SEED_PRODUCTS) {
      const { id, ...data } = product;
      const clean = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'products', id), clean);
    }

    // Mark seeded
    await setDoc(doc(db, 'settings', 'seeded'), { seededAt: new Date().toISOString() });
    console.log('[firestore] Seeded initial products.');
  } catch (err) {
    console.error('[firestore] Seeding failed:', err);
  } finally {
    _seedingInProgress = false;
  }
}
