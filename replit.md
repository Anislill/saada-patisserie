# Saada Pâtisserie

A full-stack pâtisserie e-commerce web app with customer-facing shop, cart, checkout, order tracking, wishlist, and an admin panel.

## Stack

- **Frontend**: React + Vite + TypeScript (`artifacts/saada-patisserie/`)
- **Backend**: Express + TypeScript (`artifacts/api-server/`)
- **Auth & DB**: Firebase Auth + Firestore
- **Images**: Cloudinary
- **Routing**: Wouter
- **State**: Zustand + TanStack Query
- **i18n**: i18next (multi-language support)

## How to run

Both workflows start automatically:

| Workflow | Command | Port |
|---|---|---|
| `artifacts/saada-patisserie: web` | `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/saada-patisserie run dev` | 5173 |
| `artifacts/api-server: API Server` | `PORT=8080 BASE_PATH=/api pnpm --filter @workspace/api-server run dev` | 8080 |

## Environment variables

All secrets are stored in Replit Secrets. Required vars:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME` (in `.replit` shared env)
- `VITE_CLOUDINARY_UPLOAD_PRESET` (in `.replit` shared env)
- `SESSION_SECRET`
- `GITHUB_PAT`

## Git

Remote: `Anislill/saada-patisserie` on GitHub. After each task, commit and push with:

```bash
git add -A && git commit -m "message" && git push origin main
```

## User preferences

- After each completed task: verify it works, then commit and push to GitHub.
- Only implement tasks explicitly requested — no unsolicited changes.
