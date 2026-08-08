import { useMemo, type ReactNode } from "react";
import { useCycloneStore } from "@/lib/cyclone/store";
import type { CycloneNode } from "@/lib/cyclone/types";
import { formatDuration } from "@/lib/cyclone/duration-format";
import { cn } from "@/lib/utils";

/**
 * Classic Halpin / MicroCYCLONE notation + cyclic return arcs.
 */
function NodeShape({
  node,
  selected,
  onSelect,
}: {
  node: CycloneNode;
  selected: boolean;
  onSelect: () => void;
}) {
  const size = 60;
  const half = size / 2;
  const ink = "var(--diagram-ink)";
  const paper = "#ffffff";
  const gold = "var(--primary)";
  const stroke = selected ? gold : ink;
  const strokeW = selected ? 2.75 : 2.1;
  const fill = selected ? "color-mix(in oklab, #cfb991 26%, white)" : paper;

  let shape: ReactNode;
  const labelY = size + 15;

  if (node.type === "QUEUE") {
    const r = half - 5;
    const sx = half + r * 0.35;
    const sy = half + r * 0.35;
    const ex = half + r * 0.95 + 4;
    const ey = half + r * 0.95 + 4;
    shape = (
      <>
        <circle cx={half} cy={half} r={r} fill={fill} stroke={stroke} strokeWidth={strokeW} />
        <line
          x1={sx}
          y1={sy}
          x2={ex}
          y2={ey}
          stroke={stroke}
          strokeWidth={strokeW}
          strokeLinecap="square"
        />
      </>
    );
  } else if (node.type === "COMBI") {
    const m = 6;
    const cut = 14;
    const path = [
      `M ${m + cut} ${m}`,
      `L ${size - m} ${m}`,
      `L ${size - m} ${size - m}`,
      `L ${m} ${size - m}`,
      `L ${m} ${m + cut}`,
      `Z`,
    ].join(" ");
    shape = (
      <>
        <path d={path} fill={fill} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="miter" />
        <line
          x1={m}
          y1={m + cut}
          x2={m + cut}
          y2={m}
          stroke={stroke}
          strokeWidth={strokeW}
          strokeLinecap="square"
        />
      </>
    );
  } else if (node.type === "NORMAL") {
    const m = 5;
    shape = (
      <rect
        x={m}
        y={m + 4}
        width={size - 2 * m}
        height={size - 2 * m - 8}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeW}
      />
    );
  } else if (node.type === "COUNTER") {
    const poleX = half - 2;
    const top = 6;
    const bottom = size - 8;
    const flagLen = 22;
    const flagDepth = 14;
    const flagMidY = top + flagDepth / 2;
    const flagPath = [
      `M ${poleX} ${top}`,
      `L ${poleX + flagLen} ${flagMidY}`,
      `L ${poleX} ${top + flagDepth}`,
      `Z`,
    ].join(" ");
    shape = (
      <>
        <line
          x1={poleX}
          y1={top}
          x2={poleX}
          y2={bottom}
          stroke={stroke}
          strokeWidth={strokeW + 0.4}
          strokeLinecap="square"
        />
        <line
          x1={poleX - 7}
          y1={bottom}
          x2={poleX + 7}
          y2={bottom}
          stroke={stroke}
          strokeWidth={strokeW}
          strokeLinecap="square"
        />
        <path
          d={flagPath}
          fill={selected ? "color-mix(in oklab, #cfb991 45%, white)" : fill}
          stroke={stroke}
          strokeWidth={strokeW}
          strokeLinejoin="miter"
        />
      </>
    );
  } else if (node.type === "CONSOLIDATE") {
    const m = 6;
    const path = [
      `M ${half} ${m}`,
      `L ${size - m} ${size - m}`,
      `L ${m} ${size - m}`,
      `Z`,
    ].join(" ");
    shape = (
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeLinejoin="miter"
      />
    );
  } else {
    const r = half - 6;
    shape = (
      <>
        <circle cx={half} cy={half} r={r} fill={fill} stroke={stroke} strokeWidth={strokeW} />
        <line
          x1={half - r + 3}
          y1={half}
          x2={half + r - 3}
          y2={half}
          stroke={stroke}
          strokeWidth={strokeW}
        />
      </>
    );
  }

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {shape}
      <text
        x={half}
        y={labelY}
        textAnchor="middle"
        fill={ink}
        style={{ fontSize: 12, fontWeight: 600, fontFamily: "Georgia, serif" }}
      >
        {node.label}
      </text>
      {node.type === "QUEUE" && (node.initialUnits != null || (node.generateCount != null && node.generateCount >= 2)) && (
        <text
          x={half}
          y={labelY + 14}
          textAnchor="middle"
          fill="var(--diagram-muted)"
          style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
        >
          {node.initialUnits != null ? `n = ${node.initialUnits}` : ""}
          {node.generateCount != null && node.generateCount >= 2
            ? `${node.initialUnits != null ? " · " : ""}GEN ${node.generateCount}`
            : ""}
        </text>
      )}
      {(node.type === "COMBI" || node.type === "NORMAL") && node.duration && (
        <text
          x={half}
          y={labelY + 14}
          textAnchor="middle"
          fill="var(--diagram-muted)"
          style={{ fontSize: 9, fontFamily: "ui-monospace, monospace" }}
        >
          {formatDuration(node.duration)}
        </text>
      )}
      {node.type === "COUNTER" && node.productionAmount != null && (
        <text
          x={half}
          y={labelY + 14}
          textAnchor="middle"
          fill="var(--diagram-muted)"
          style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
        >
          +{node.productionAmount}
        </text>
      )}
      {node.type === "CONSOLIDATE" && (
        <text
          x={half}
          y={labelY + 14}
          textAnchor="middle"
          fill="var(--diagram-muted)"
          style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
        >
          CON {node.consolidateCount ?? 2}
        </text>
      )}
    </g>
  );
}

function linkPath(
  from: CycloneNode,
  to: CycloneNode,
  cycle: boolean,
): { d: string } {
  const size = 60;
  const half = size / 2;
  const x1 = from.x + half;
  const y1 = from.y + half;
  const x2 = to.x + half;
  const y2 = to.y + half;
  if (!cycle) {
    return { d: `M ${x1} ${y1} L ${x2} ${y2}` };
  }
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ox = (-dy / len) * 28;
  const oy = (dx / len) * 28;
  return { d: `M ${x1} ${y1} Q ${mx + ox} ${my + oy} ${x2} ${y2}` };
}

function isCycleLink(from: CycloneNode, to: CycloneNode): boolean {
  if (to.type === "QUEUE" && (from.type === "COMBI" || from.type === "NORMAL")) return true;
  if (from.type === "QUEUE" && to.type === "QUEUE") return true;
  return false;
}

export function DiagramCanvas() {
  const model = useCycloneStore((s) => s.model);
  const selectedNodeId = useCycloneStore((s) => s.selectedNodeId);
  const selectNode = useCycloneStore((s) => s.selectNode);

  const width = useMemo(() => {
    if (!model?.nodes.length) return 640;
    const maxX = Math.max(...model.nodes.map((n) => n.x + 80));
    return Math.max(640, maxX + 40);
  }, [model]);

  const height = useMemo(() => {
    if (!model?.nodes.length) return 360;
    const maxY = Math.max(...model.nodes.map((n) => n.y + 100));
    return Math.max(360, maxY + 40);
  }, [model]);

  const nodeMap = useMemo(() => {
    const m = new Map<string, CycloneNode>();
    if (model) for (const n of model.nodes) m.set(n.id, n);
    return m;
  }, [model]);

  const linksDrawn = useMemo(() => {
    if (!model) return [];
    return model.links
      .map((link) => {
        const from = nodeMap.get(link.from);
        const to = nodeMap.get(link.to);
        if (!from || !to) return null;
        const cycle = isCycleLink(from, to);
        return { link, cycle, path: linkPath(from, to, cycle) };
      })
      .filter(Boolean) as {
      link: (typeof model.links)[0];
      cycle: boolean;
      path: { d: string };
    }[];
  }, [model.links, nodeMap]);

  if (!model) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed border-primary/30 bg-diagram text-sm text-muted-foreground">
        Draw a model to see the CYCLONE diagram.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full min-h-[280px] w-full max-w-full min-w-0 overflow-x-auto overflow-y-auto rounded-[var(--radius-md)] border-2 border-primary/40 bg-diagram shadow-sm",
      )}
      onClick={() => selectNode(null)}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block max-w-none"
        role="img"
        aria-label={`CYCLONE model ${model.name}`}
      >
        <defs>
          <marker
            id="arrow-halpin"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--diagram-ink)" />
          </marker>
          <marker
            id="arrow-halpin-cycle"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
          </marker>
          <pattern id="acd-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--diagram-grid)"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="var(--diagram)" />
        <rect width="100%" height="100%" fill="url(#acd-grid)" opacity="0.7" />

        {linksDrawn.map(({ link, cycle, path }) => (
          <path
            key={link.id}
            d={path.d}
            fill="none"
            stroke={cycle ? "var(--primary)" : "var(--diagram-ink)"}
            strokeWidth={cycle ? 2.25 : 1.75}
            strokeDasharray={cycle ? "7 4" : undefined}
            markerEnd={cycle ? "url(#arrow-halpin-cycle)" : "url(#arrow-halpin)"}
          />
        ))}

        {model.nodes.map((node) => (
          <NodeShape
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={() => selectNode(node.id)}
          />
        ))}
      </svg>
    </div>
  );
}
