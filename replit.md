# Saada Pâtisserie

A full-stack e-commerce web application for a pastry shop, built with React + Vite on the frontend and an Express API server on the backend.

## Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Zustand, TanStack Query, Wouter
- **Backend**: Express 5, TypeScript, esbuild
- **Auth & Database**: Firebase (Firestore + Firebase Auth)
- **i18n**: i18next with browser language detection
- **Monorepo**: pnpm workspaces

## Running the project

Both services start automatically via the configured workflows:

| Service | Workflow | Port |
|---------|----------|------|
| Frontend (saada-patisserie) | `artifacts/saada-patisserie: web` | 5173 |
| API Server | `artifacts/api-server: API Server` | 8080 |

## Environment variables / secrets

All Firebase credentials are stored as Replit secrets (`VITE_FIREBASE_*`). Do not hard-code these values.

## Development workflow

1. Make changes
2. Verify in the preview pane (frontend at `/`)
3. Commit and push to GitHub (`origin main`) after each completed task

## User preferences

- After each completed task: verify everything works, then commit and push to GitHub.
- Only implement tasks explicitly requested — no unsolicited additions.
