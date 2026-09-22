# Paper version freeze

This repository is under journal review. **Do not change the software version
strings or simulation engine that papers cite**, or reviewers will see a
different product than the manuscript claims.

## Pinned releases

| Manuscript | Claimed version | Immutable pin |
|---|---|---|
| **ITcon** (pavement / CYCLONE framework) | **v1.7.5** | GitHub tag [`v1.7.5`](https://github.com/m46d45/neo-cyclone/releases/tag/v1.7.5) · commit `e6ff10dfe630c6f8cf11d18af4b47d4767c3064f` · pack [`docs/itcon-archive`](./itcon-archive/) |
| **Software Impacts** (OSP) | **v1.6.2.1** | GitHub tag [`v1.6.2.1`](https://github.com/m46d45/neo-cyclone/releases/tag/v1.6.2.1) · commit `cdc503cf10d04bd06c4418324019c84afe3a8792` · metadata [`docs/software-impacts/`](./software-impacts/) |

Zenodo concept DOI (all versions): https://doi.org/10.5281/zenodo.21864969  
Prefer a **version DOI** minted from the cited tag when available.

## What reviewers must use

Software used for the **ITcon reported results** is Neo-CYCLONE **v1.7.5**
(tag `v1.7.5`, commit `e6ff10d…`). Reproduce from that tag (or a Zenodo deposit
of that tag) and from [`docs/itcon-archive`](./itcon-archive/) — **not** from a
later commit on `main`, and **not** by assuming the live studio always matches
the paper.

The live demo https://neo-cyclone.vercel.app/ is convenient for browsing. It
tracks deployment of `main` and **may diverge** after the archival tag.
Identical productivity numbers are guaranteed only on the pinned tag.

## Freeze rules (while under review)

**Do not bump** (keep ITcon surface at **1.7.5**):

- `package.json` → `version`
- `CITATION.cff` → `version`
- `src/lib/cyclone/prompt-template.ts` → `PRODUCT_VERSION`
- User-visible manual / PDF version badges that cite the ITcon release

**Do not edit** (ITcon Tables 3, 4, 7):

- `src/lib/cyclone/engine.ts`
- `src/lib/cyclone/distributions.ts`
- `src/lib/cyclone/nl-parser.ts` and model builder used by Draw Model
- `src/lib/cyclone/run-limits.ts`
- Files under `docs/itcon-archive/` that encode prompts or tabulated results

**Do not retarget** Software Impacts C1 from **v1.6.2.1** to 1.7.x while that
OSP is in review — the two papers cite **different** frozen tags on purpose.

Allowed on `main` during review: documentation clarification, typo fixes,
and features that **do not** change engine numerics or the version strings
above. If engine work is required after acceptance, cut a **new** version tag
and update the manuscript citation in a revision — do not silently overwrite
`v1.7.5` / `v1.6.2.1`.
