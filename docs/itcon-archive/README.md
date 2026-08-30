# ITcon archive — Neo-CYCLONE v1.7.5

Reproducibility pack for the manuscript
**Neo-CYCLONE: A Browser-Based Open CYCLONE Framework for Construction Operations Simulation — Application to Rigid Pavement Production.**

| Item | Location |
|---|---|
| Source tag / version | `package.json` → `1.7.5` |
| Studio | https://neo-cyclone.vercel.app/ |
| Engine | `src/lib/cyclone/nl-parser.ts` (`parseOperationDescription`) + `src/lib/cyclone/engine.ts` (`runCyclone`) |
| Seeds | `12345, 1, 7, 13, 21, 42, 99, 2024, 2026, 31415` |
| Stop rule | `maxCycles = 100`; product horizon `100 × 60 = 6000` min |

## Files

- `ITcon_Reproduce_Prompts_v175.txt` — paste-ready prompts for earthmoving, girder, and pavement Sc 1–7.
- `Girder_multiseed_v175__*.csv` — Table 4, 10 seeds.
- `Pavement_multiseed_v175__*.csv` — Table 7, 7 × 10 seeds, ranking sheet.

Excel workbooks with the same numbers live in the manuscript working folder; CSV mirrors here are the public checkable archive.

## Do not swap lognormal pairs

Manuscript Table 6 lists MLE **μ, σ of ln(X)** on field discharge intervals.

The engine token `lognormal a b` is **mean and sd of duration in minutes**. Table 7 was generated from the minute-scale pair in the prompt file. Pasting Table 6 into a Duration line will not recover Table 7.

## Worked checks (v1.7.5 `runCyclone`)

- Girder, seed `12345`: **0.600** girder/h after 60 cycles (horizon cuts a ~99 min cycle). Ten-seed mean **0.601**. Published WebCYCLONE ≈ 0.615 (−2.3%).
- Pavement Sc 1, seed `12345`, Discharge `lognormal 11.05 5.27`, production = 10 m³: **52.70 m³/h**, truck wait 28.4 min, paver idle 0.5%. Ten-seed mean **54.0 m³/h**.

## Ranking (pavement, 10 seeds)

- Volume 10 m³ > 4 m³ > 8 m³: preserved 10/10.
- Supplier SSC > MPM-A: preserved 10/10.
- Segment Panjang > Sedang (field): inverted on 7/10 seeds, including 12345.
