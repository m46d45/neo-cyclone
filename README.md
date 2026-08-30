# Neo-CYCLONE

**A browser-based open CYCLONE framework for construction operations simulation**

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21864969.svg)](https://doi.org/10.5281/zenodo.21864969)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Web studio for construction operation simulation with Halpin Activity Cycle Diagrams (QUEUE, COMBI, NORMAL, COUNTER), a structured prompt, a deterministic parser, and a discrete-event engine that runs in the browser (utilisation, production, productivity). An optional constrained assistant may read a completed run; it does not build the network that is executed.

**Live studio:** https://neo-cyclone.vercel.app/  
**Manual:** https://neo-cyclone.vercel.app/manual  
**ITcon tag (v1.7.5):** https://github.com/m46d45/neo-cyclone/releases/tag/v1.7.5  
**ITcon archive:** https://github.com/m46d45/neo-cyclone/tree/v1.7.5/docs/itcon-archive  
**Zenodo (concept DOI):** https://doi.org/10.5281/zenodo.21864969  
**Author:** Muhamad Abduh ([ORCID](https://orcid.org/0000-0001-6926-6665)) · abduh@itb.ac.id

## Citation

For the engine used in the ITcon manuscript, cite GitHub tag `v1.7.5` (commit `e6ff10dfe630c6f8cf11d18af4b47d4767c3064f`). The Zenodo badge is the concept DOI; use a newer version DOI if Zenodo mints one from this tag.

```bibtex
@software{abduh_neocyclone_2026,
  author       = {Abduh, Muhamad},
  title        = {Neo-CYCLONE},
  year         = {2026},
  version      = {1.7.5},
  publisher    = {GitHub},
  url          = {https://github.com/m46d45/neo-cyclone/releases/tag/v1.7.5},
  note         = {Browser-based CYCLONE framework; structured prompt and in-browser engine}
}
```

See also [CITATION.cff](./CITATION.cff) · Source: https://github.com/m46d45/neo-cyclone

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
| `XAI_API_KEY` | Optional | xAI API key for the optional constrained assistant. Without it, the deterministic parser and engine still run. |
| `BETTER_AUTH_SECRET` | Optional | Only if you enable auth + Postgres |
| `DATABASE_URL` | Optional | Neon/Postgres if you want real auth DB |
| `BETTER_AUTH_URL` | Optional | Public site URL when auth is on |

5. Deploy → open the Vercel URL.

### One-click style

After the repo exists on GitHub:

[https://vercel.com/new/clone?repository-url=https://github.com/m46d45/neo-cyclone](https://vercel.com/new/clone?repository-url=https://github.com/m46d45/neo-cyclone)

## Workflow in the app

1. Write a **structured prompt** (resource cycles + durations in **minutes**).  
2. **Draw Model** → inspect **CYCLONE Model**.  
3. Set **max cycles**, **seed** (default `12345`), **max time**.  
4. **Simulate** → **Results**.

See [docs/USER_MANUAL.md](docs/USER_MANUAL.md).

## License / tribute

**License:** [MIT](./LICENSE) — Copyright (c) 2026 Muhamad Abduh.

Methodology after Professor **Daniel W. Halpin** (Purdue) — CYCLONE / WebCYCLONE. Neo-CYCLONE is an independent browser-based implementation for education and research.
