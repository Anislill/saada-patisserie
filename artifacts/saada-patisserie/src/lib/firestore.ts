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

// Mock API layer for when Firebase isn't available
export const firestoreMock = {
  getProducts: async () => SEED_PRODUCTS,
  getProductBySlug: async (slug: string) => SEED_PRODUCTS.find(p => p.slug === slug),
  getCategories: async () => SEED_CATEGORIES,
  getTestimonials: async () => SEED_TESTIMONIALS,
};
