# Product Management — Frontend

React + TypeScript + Vite frontend for retail product management.

## Live Demo

**Production URL:** https://frontend-retailapp.onrender.com

> Hosted on Render (free tier — cold start ~30s after inactivity).
> Connects to backend at https://backend-retailapp.onrender.com/api

---

## Tech Stack

- **React 18** + TypeScript
- **Vite** — build tool
- **TailwindCSS** — styling
- **React Query** — server state & caching
- **Zustand** — client state
- **Axios** — HTTP client
- **React Hot Toast** — notifications

---

## Run locally

```bash
npm install
npm run dev
```

App will be available at `http://localhost:5173`. Requires the backend running at `http://localhost:5000`.

### Environment

| File | Used when |
|------|-----------|
| `.env` | Local dev (`npm run dev`) |
| `.env.production` | Production build (`npm run build`) |

```env
# .env
VITE_API_URL=http://localhost:5000/api

# .env.production
VITE_API_URL=https://backend-retailapp.onrender.com/api
```

---

## Build for production

```bash
npm run build
```
