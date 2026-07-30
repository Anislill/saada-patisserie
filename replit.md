# Saada Pâtisserie

A complete luxury French pastry e-commerce website with full admin dashboard, multilingual support (FR/AR/EN), Firebase backend, and production-ready architecture.

## Run & Operate

- `pnpm --filter @workspace/saada-patisserie run dev` — run the storefront (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, not used by main app)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- **Frontend**: React + Vite + TypeScript, Tailwind CSS, Framer Motion, Wouter routing
- **State**: Zustand (cart, wishlist, auth) — persisted to localStorage
- **Backend**: Firebase (Auth + Firestore + Storage)
- **i18n**: i18next — French primary, Arabic, English
- **UI**: shadcn/ui components, Lucide icons
- pnpm workspaces, Node.js 24, TypeScript 5.9

## Where things live

- `artifacts/saada-patisserie/src/` — main app
  - `pages/` — all customer + admin pages
  - `components/layout/` — Header, Footer, CartDrawer, SearchOverlay
  - `components/admin/` — AdminLayout sidebar
  - `lib/firebase.ts` — Firebase init (reads VITE_ env vars)
  - `lib/firestore.ts` — all Firestore data helpers (currently uses seed data; activate to use real Firestore)
  - `lib/i18n.ts` — i18n config
  - `store/` — Zustand stores (cartStore, wishlistStore, authStore)
  - `locales/` — translation files (fr.ts, ar.ts, en.ts)
- `attached_assets/` — logo + generated product images

## Brand Identity

- Logo: `attached_assets/0_file_00000000873481f494288e53319f68ef-removebg-preview_1785313194757.png`
- Background: #FAF9F6 | Text: #0F0E0D | Accent: #1F3D2E | Borders/Gold: #C9A867 | Error: #8A2E2E
- Fonts: Playfair Display (headings) + Montserrat (body)

## Customer Routes

| Path | Page |
|------|------|
| `/` | Home — hero, categories, bestsellers, testimonials, newsletter |
| `/boutique` | Shop — product grid with sidebar filters |
| `/boutique/:slug` | Product detail — gallery, variants, add to cart |
| `/panier` | Cart page |
| `/commande` | Checkout — multi-step with delivery/pickup |
| `/commande/confirmation` | Order confirmation |
| `/suivi-commande` | Order tracking |
| `/compte` | Auth — login / register |
| `/compte/profil` | Profile editor |
| `/compte/commandes` | Order history |
| `/compte/favoris` | Wishlist |
| `/a-propos` | About |
| `/contact` | Contact form |
| `/faq` | FAQ accordion |
| `/mentions-legales` | Legal |
| `/politique-confidentialite` | Privacy |

## Admin Routes (`/admin/*`)

| Path | Page |
|------|------|
| `/admin` | Login (Firebase Auth) |
| `/admin/dashboard` | Overview stats |
| `/admin/produits` | Product list |
| `/admin/produits/nouveau` | Add product |
| `/admin/produits/:id` | Edit product |
| `/admin/categories` | Category management |
| `/admin/commandes` | Orders list |
| `/admin/commandes/:id` | Order detail + status |
| `/admin/clients` | Customer list |
| `/admin/promotions` | Coupons & promos |
| `/admin/contenu` | Content (banners, FAQ, testimonials) |
| `/admin/parametres` | Store settings (info, delivery, SEO, social) |
| `/admin/comptes` | Admin user management |

## Firebase Setup

Required secrets (set in Replit Secrets):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Firebase services needed: Authentication (Email/Password), Firestore, Storage.

## Architecture decisions

- Firebase SDK runs entirely client-side — no Express API routes used for app data
- Seed data in `firestore.ts` provides full content even before Firestore is activated
- Zustand stores persist cart/wishlist to localStorage for guest users
- Admin protected via Firebase Auth + Firestore `isAdmin` flag on user document
- RTL layout auto-applied when Arabic language is selected (html dir attribute)
- Color palette applied as CSS custom properties in `index.css` (HSL values)

## Gotchas

- `src/hooks/use-toast.ts` re-exports from `use-toast-core.ts` — do NOT make it self-import
- All VITE_ env vars must be prefixed with `VITE_` to be accessible in the frontend
- When Arabic is active, the entire layout flips to RTL — test all components in both directions

## User preferences

- Brand name: Saada Pâtisserie
- Primary language: French
- Payment: Cash on delivery only
- Logo file: `attached_assets/0_file_00000000873481f494288e53319f68ef-removebg-preview_1785313194757.png`
