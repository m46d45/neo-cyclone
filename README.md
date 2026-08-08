# Neo-CYCLONE

**AI-agent of Daniel W. Halpin's CYCLONE**

Web studio for construction operation simulation with Halpin Activity Cycle Diagrams (QUEUE, COMBI, NORMAL, COUNTER), a structured English prompt, and discrete-event results (utilization, production, productivity).

## Stack

- React 19 · TypeScript · Vite · TanStack Start  
- Tailwind · Recharts · Zustand  
- Deploy target: **Vercel** (Nitro `vercel` preset)

## Local development

```bash
npm install
npm run dev          # http://localhost:8080
npm run typecheck
npm run build
```

## Deploy to Vercel (GitHub)

1. Push this repository to GitHub (already prepared for account `m46d45` as `neo-cyclone` if you used the automated setup).
2. In [Vercel](https://vercel.com): **Add New Project** → import **`neo-cyclone`**.
3. Framework: leave auto-detect (or Vite). Build command: `npm run build`. Output is Nitro’s `.vercel/output` (handled automatically).
4. **Environment variables** (Project → Settings → Environment Variables):

| Name | Required | Notes |
|------|----------|--------|
| `XAI_API_KEY` | Optional | xAI API key for AI model drafting. Without it, local prompt parsing still builds models. |
| `BETTER_AUTH_SECRET` | Optional | Only if you enable auth + Postgres |
| `DATABASE_URL` | Optional | Neon/Postgres if you want real auth DB |
| `BETTER_AUTH_URL` | Optional | Public site URL when auth is on |

5. Deploy → open the Vercel URL.

### One-click style

After the repo exists on GitHub:

[https://vercel.com/new/clone?repository-url=https://github.com/m46d45/neo-cyclone](https://vercel.com/new/clone?repository-url=https://github.com/m46d45/neo-cyclone)

## Workflow in the app

1. Write a **prompt** (resource cycles + durations in **minutes**).  
2. **Draw Model** → inspect **CYCLONE Model**.  
3. Set **max cycles**, **seed** (default `12345`), **max time**.  
4. **Simulate** → **Results**.

See [docs/USER_MANUAL.md](docs/USER_MANUAL.md).

## License / tribute

Methodology after Professor **Daniel W. Halpin** (Purdue) — CYCLONE / WebCYCLONE. Neo-CYCLONE is an independent modern AI-assisted implementation for education and research.
