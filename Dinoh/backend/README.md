# DINOH Backend

Simple Express + TypeScript REST API for the DINOH frontend.

## Setup

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

Server runs on `http://localhost:4000` by default.

## Endpoints

| Method | Path                  | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/health`         | Health check                         |
| GET    | `/api/stats`          | Dashboard stats                      |
| GET    | `/api/apps`           | All apps                             |
| GET    | `/api/apps/top-rated` | Top rated apps                       |
| GET    | `/api/apps/:id`       | Single app                           |
| GET    | `/api/explore?q=...`  | Explore items, optional search query |
| GET    | `/api/submissions`    | List submitted apps (in-memory)      |
| POST   | `/api/submissions`    | Submit a new app                     |

## Submit payload

```json
{
  "url": "https://...",
  "name": "My App",
  "description": "What it does",
  "tags": ["AI", "Productivity"],
  "function": "IT",
  "department": "ITOT",
  "confidentiality": "C2",
  "submittedBy": { "name": "Mara Spichiger", "email": "mara.spichiger@roche.com" }
}
```

## Notes

- Data is in-memory (resets on restart). Replace `src/data/store.ts` with a real database later.
- CORS origin is configurable via `CORS_ORIGIN` env var (defaults to Angular dev server `http://localhost:4200`).
