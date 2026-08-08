import type { CycloneModel, CycloneNode } from "./types";

/**
 * Ensure diagram nodes are not stacked (overlapping labels).
 * Safe to call after AI/DSL load; preserves relative order when already spaced.
 */
export function ensureReadableLayout(model: CycloneModel): CycloneModel {
  const nodes = model.nodes.map((n) => ({ ...n }));
  // If everything is on top of each other (or all zero), spread lightly first
  const xs = new Set(nodes.map((n) => Math.round(n.x)));
  const ys = new Set(nodes.map((n) => Math.round(n.y)));
  if (nodes.length > 2 && xs.size <= 2 && ys.size <= 2) {
    simpleGrid(nodes);
  }
  resolveCollisions(nodes, 155, 115);
  return { ...model, nodes };
}

function simpleGrid(nodes: CycloneNode[]): void {
  const COL = 180;
  const ROW = 140;
  const queues = nodes.filter((n) => n.type === "QUEUE");
  const others = nodes.filter((n) => n.type !== "QUEUE");
  queues.forEach((n, i) => {
    n.x = 70;
    n.y = 70 + i * ROW;
  });
  others.forEach((n, i) => {
    n.x = 280 + (i % 4) * COL;
    n.y = 70 + Math.floor(i / 4) * ROW;
  });
}

function resolveCollisions(nodes: CycloneNode[], minDx: number, minDy: number): void {
  for (let pass = 0; pass < 12; pass++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (Math.abs(dx) >= minDx || Math.abs(dy) >= minDy) continue;
        if (Math.abs(dy) <= Math.abs(dx)) {
          const push = (minDy - Math.abs(dy)) / 2 + 6;
          if (dy >= 0) {
            b.y += push;
            a.y -= push * 0.2;
          } else {
            b.y -= push;
            a.y += push * 0.2;
          }
        } else {
          const push = (minDx - Math.abs(dx)) / 2 + 6;
          if (dx >= 0) {
            b.x += push;
            a.x -= push * 0.15;
          } else {
            b.x -= push;
            a.x += push * 0.15;
          }
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
  for (const n of nodes) {
    n.x = Math.max(20, Math.round(n.x));
    n.y = Math.max(20, Math.round(n.y));
  }
}
