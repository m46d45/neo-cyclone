import type { CycloneModel, CycloneNode } from "./types";

/**
 * Post-pass after builder layout: keep Halpin-style spacing readable.
 * Prefer the builder's row/column structure; only separate true overlaps.
 */
export function ensureReadableLayout(model: CycloneModel): CycloneModel {
  const nodes = model.nodes.map((n) => ({ ...n }));
  const xs = new Set(nodes.map((n) => Math.round(n.x / 20)));
  const ys = new Set(nodes.map((n) => Math.round(n.y / 20)));
  if (nodes.length > 2 && xs.size <= 2 && ys.size <= 2) {
    simpleGrid(nodes);
  }
  resolveCollisions(nodes, 150, 112);
  // Keep everything on-canvas with modest padding
  let minX = Infinity;
  let minY = Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
  }
  const ox = minX < 36 ? 36 - minX : 0;
  const oy = minY < 36 ? 36 - minY : 0;
  for (const n of nodes) {
    n.x = Math.max(20, Math.round(n.x + ox));
    n.y = Math.max(20, Math.round(n.y + oy));
  }
  return { ...model, nodes };
}

function simpleGrid(nodes: CycloneNode[]): void {
  const COL = 170;
  const ROW = 140;
  const homes = nodes.filter((n) => n.type === "QUEUE" && (n.initialUnits ?? 0) > 0);
  const work = nodes.filter((n) => !(n.type === "QUEUE" && (n.initialUnits ?? 0) > 0));
  homes.forEach((n, i) => {
    n.x = 64;
    n.y = 72 + i * ROW;
  });
  work.forEach((n, i) => {
    n.x = 240 + (i % 5) * COL;
    n.y = 72 + Math.floor(i / 5) * ROW;
  });
}

function resolveCollisions(nodes: CycloneNode[], minDx: number, minDy: number): void {
  for (let pass = 0; pass < 16; pass++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (Math.abs(dx) >= minDx || Math.abs(dy) >= minDy) continue;
        // Prefer vertical separation (keep L→R columns)
        if (Math.abs(dx) < minDx * 0.55) {
          const push = (minDy - Math.abs(dy)) / 2 + 8;
          if (dy >= 0) {
            b.y += push;
            a.y -= push * 0.15;
          } else {
            b.y -= push;
            a.y += push * 0.15;
          }
        } else {
          const push = (minDx - Math.abs(dx)) / 2 + 8;
          if (dx >= 0) {
            b.x += push;
            a.x -= push * 0.1;
          } else {
            b.x -= push;
            a.x += push * 0.1;
          }
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
}
