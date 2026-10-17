# Paper version freeze

Two published tags stay immutable. New teaching and IGLC work lives on a
**new** version. Do not move `v1.7.5` or `v1.6.2.1`.

## Pinned releases

| Manuscript | Claimed version | Immutable pin |
|---|---|---|
| **ITcon** (pavement / CYCLONE framework) | **v1.7.5** | GitHub tag [`v1.7.5`](https://github.com/m46d45/neo-cyclone/releases/tag/v1.7.5) · commit `e6ff10dfe630c6f8cf11d18af4b47d4767c3064f` · pack [`docs/itcon-archive`](./itcon-archive/) |
| **Software Impacts** (OSP) | **v1.6.2.1** | GitHub tag [`v1.6.2.1`](https://github.com/m46d45/neo-cyclone/releases/tag/v1.6.2.1) · commit `cdc503cf10d04bd06c4418324019c84afe3a8792` · metadata [`docs/software-impacts/`](./software-impacts/) |
| **ICE session / IGLC candidate** | **v1.8.0** | This working tree (`PRODUCT_VERSION`, `package.json`, `CITATION.cff`). Tag and production deploy wait for the author's approval. |

Zenodo concept DOI (all versions): https://doi.org/10.5281/zenodo.21864969  
Prefer a **version DOI** minted from the cited tag when available.

## What reviewers must use

Software used for the **ITcon reported results** is Neo-CYCLONE **v1.7.5**
(tag `v1.7.5`, commit `e6ff10d…`). Reproduce from that tag (or a Zenodo deposit
of that tag) and from [`docs/itcon-archive`](./itcon-archive/).

v1.8.0 keeps those productivities (seed `12345`, pavement Sc 1–7 and the
girder run). The change in `engine.ts` is the branch **empirical share**
denominator only. `src/lib/cyclone/engine.paper.test.ts` locks the archive
numbers. The live demo https://neo-cyclone.vercel.app/ still tracks the last
production deploy until v1.8.0 is tagged and deployed.

## Freeze rules

**Do not move or retag** `v1.7.5` or `v1.6.2.1`.

**Do not edit** the OSP manuscript under `docs/software-impacts/` to cite 1.8.0.
C1 stays **v1.6.2.1**.

**Do not edit** files under `docs/itcon-archive/` that encode the v1.7.5 prompts
or tabulated results.

Current product strings (`package.json` version, `CITATION.cff`, `PRODUCT_VERSION`,
the manual) identify **v1.8.0**. After the author approves, tag that commit and
point GitHub Latest and Vercel at it. Until then, do not publish a release.
