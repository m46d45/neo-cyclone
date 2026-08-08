import { useMemo, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { useCycloneStore } from "@/lib/cyclone/store";
import type { CycloneNode } from "@/lib/cyclone/types";
import { formatDuration } from "@/lib/cyclone/duration-format";
import { downloadSvgElementAsPng, safeFilename } from "@/lib/cyclone/export-utils";
import { ZoomToolbar, useZoomState } from "@/components/cyclone/ZoomToolbar";
import { cn } from "@/lib/utils";

/**
 * Halpin shapes + Neo-CYCLONE arrows: solid black = forward; dashed gold = return.
 */
/** Split long labels so multi-resource diagrams do not look like garbage text. */
function wrapLabel(label: string, maxChars = 13): string[] {
  const s = label.trim();
  if (s.length <= maxChars) return [s];
  // Prefer break at space / camelCase boundary
  const parts = s.split(/\s+/);
  if (parts.length > 1) {
    const lines: string[] = [];
    let cur = "";
    for (const w of parts) {
      if (!cur) cur = w;
      else if ((cur + " " + w).length <= maxChars) cur = cur + " " + w;
      else {
        lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
  }
  // camelCase: SupplyBrick → Supply / Brick
  const camel = s.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
  if (camel.length > 1) return wrapLabel(camel.join(" "), maxChars);
  return [s.slice(0, maxChars), s.slice(maxChars, maxChars * 2)].filter(Boolean);
}

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
      {(() => {
        const lines = wrapLabel(node.label, 12);
        const subY = labelY + lines.length * 13;
        let sub = "";
        if (node.type === "QUEUE") {
          const bits: string[] = [];
          if (node.initialUnits != null) bits.push(`n = ${node.initialUnits}`);
          if (node.generateCount != null && node.generateCount >= 2) bits.push(`GEN ${node.generateCount}`);
          sub = bits.join(" · ");
        } else if ((node.type === "COMBI" || node.type === "NORMAL") && node.duration) {
          sub = formatDuration(node.duration);
        } else if (node.type === "COUNTER" && node.productionAmount != null) {
          sub = `+${node.productionAmount}`;
        } else if (node.type === "CONSOLIDATE") {
          sub = `CON ${node.consolidateCount ?? 2}`;
        }
        return (
          <>
            <text
              x={half}
              y={labelY}
              textAnchor="middle"
              fill={ink}
              style={{ fontSize: 11, fontWeight: 600, fontFamily: "Georgia, serif" }}
            >
              {lines.map((ln, i) => (
                <tspan key={i} x={half} dy={i === 0 ? 0 : 13}>
                  {ln}
                </tspan>
              ))}
            </text>
            {sub ? (
              <text
                x={half}
                y={subY + 12}
                textAnchor="middle"
                fill="var(--diagram-muted)"
                style={{ fontSize: 9, fontFamily: "ui-monospace, monospace" }}
              >
                {sub}
              </text>
            ) : null}
          </>
        );
      })()}
    </g>
  );
}

/**
 * Path between node centers, trimmed to shape edges so **arrowheads stay visible**.
 * Return arcs use a curved bow; forward arcs are straight.
 */
function linkPath(
  from: CycloneNode,
  to: CycloneNode,
  isReturn: boolean,
): { d: string; mx: number; my: number } {
  const half = 30;
  const ax = from.x + half;
  const ay = from.y + half;
  const bx = to.x + half;
  const by = to.y + half;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // Keep stroke outside the symbol so the arrow tip is not buried under the shape
  const startPad = 32;
  const endPad = 36;
  const x1 = ax + ux * startPad;
  const y1 = ay + uy * startPad;
  const x2 = bx - ux * endPad;
  const y2 = by - uy * endPad;

  if (!isReturn) {
    return {
      d: `M ${x1} ${y1} L ${x2} ${y2}`,
      mx: (x1 + x2) / 2,
      my: (y1 + y2) / 2 - 8,
    };
  }

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const px = -uy;
  const py = ux;
  const span = Math.hypot(x2 - x1, y2 - y1);
  const bow = Math.min(90, Math.max(44, span * 0.32));
  // Prefer bow "outside" (down/right-ish) for return arcs
  let sx = px;
  let sy = py;
  if (sy < 0) {
    sx = -sx;
    sy = -sy;
  }
  const cx = mx + sx * bow;
  const cy = my + sy * bow;
  return {
    d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`,
    mx: (x1 + 2 * cx + x2) / 4,
    my: (y1 + 2 * cy + y2) / 4 - 6,
  };
}

/**
 * Neo-CYCLONE arrow standard (teaching clarity; may differ from Halpin print style):
 * - Forward = solid black: work flow toward production (typically toward COUNTER).
 * - Return  = dashed gold: resource going home / closing its cycle (into a QUEUE).
 * After COUNTER, any arc that re-enters a QUEUE is return (cyclic resource).
 */
function isReturnLink(from: CycloneNode, to: CycloneNode): boolean {
  // Home QUEUE is the idle pool — every arc into a QUEUE closes a resource cycle.
  if (to.type === "QUEUE") return true;
  return false;
}

export function DiagramCanvas() {
  const model = useCycloneStore((s) => s.model);
  const selectedNodeId = useCycloneStore((s) => s.selectedNodeId);
  const selectNode = useCycloneStore((s) => s.selectNode);
  const svgRef = useRef<SVGSVGElement>(null);
  const { zoom, minZoom, maxZoom, zoomIn, zoomOut, zoomReset } = useZoomState(1, 0.25, 0.5, 2.5);

  const width = useMemo(() => {
    if (!model?.nodes.length) return 640;
    const maxX = Math.max(...model.nodes.map((n) => n.x + 80));
    return Math.max(640, maxX + 40);
  }, [model]);

  const height = useMemo(() => {
    if (!model?.nodes.length) return 400;
    const maxY = Math.max(...model.nodes.map((n) => n.y + 100));
    // Extra space for arrow legend at bottom
    return Math.max(400, maxY + 56);
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
        const cycle = isReturnLink(from, to);
        return { link, cycle, path: linkPath(from, to, cycle) };
      })
      .filter(Boolean) as {
      link: (typeof model.links)[0];
      /** true = return (dashed gold); false = forward (solid black) */
      cycle: boolean;
      path: { d: string; mx: number; my: number };
    }[];
  }, [model.links, nodeMap]);

  if (!model) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed border-primary/30 bg-diagram text-sm text-muted-foreground">
        Draw a model to see the CYCLONE diagram.
      </div>
    );
  }

  async function onDownloadPng() {
    const svg = svgRef.current;
    if (!svg) {
      toast.error("Diagram not ready");
      return;
    }
    try {
      await downloadSvgElementAsPng(svg, safeFilename(`model_${model.id}`, "png"), {
        scale: 2,
        background: "#ffffff",
      });
      toast.success("Diagram PNG downloaded");
    } catch {
      toast.error("Could not export diagram");
    }
  }

  return (
    <div
      className={cn(
        "relative h-full min-h-[280px] w-full max-w-full min-w-0 overflow-hidden rounded-[var(--radius-md)] border-2 border-primary/40 bg-diagram shadow-sm",
      )}
      onClick={() => selectNode(null)}
    >
      <div className="absolute right-2 top-2 z-10" onClick={(e) => e.stopPropagation()}>
        <ZoomToolbar
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomReset={zoomReset}
          onDownload={() => void onDownloadPng()}
          downloadLabel="PNG"
        />
      </div>
      <div className="h-full w-full overflow-auto">
        <div style={{ width: width * zoom, height: height * zoom, minWidth: "100%" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block max-w-none origin-top-left"
        style={{ transform: `scale(${zoom})` }}
        role="img"
        aria-label={`CYCLONE model ${model.name}`}
      >
        <defs>
          <marker
            id="arrow-halpin"
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="10"
            markerHeight="10"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 11 6 L 0 11 z" fill="var(--diagram-ink)" />
          </marker>
          <marker
            id="arrow-halpin-cycle"
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="11"
            markerHeight="11"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 11 6 L 0 11 z" fill="var(--primary)" />
          </marker>
          <marker
            id="arrow-halpin-branch"
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="10"
            markerHeight="10"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 11 6 L 0 11 z" fill="#8b5a2b" />
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

        {linksDrawn.map(({ link, cycle, path }) => {
          const isBranch = link.probability != null;
          return (
            <g key={link.id}>
              <path
                d={path.d}
                fill="none"
                stroke={
                  cycle
                    ? "var(--primary)"
                    : isBranch
                      ? "#8b5a2b"
                      : "var(--diagram-ink)"
                }
                strokeWidth={cycle ? 2.25 : isBranch ? 2.1 : 1.85}
                strokeDasharray={cycle ? "7 4" : undefined}
                markerEnd={
                  cycle
                    ? "url(#arrow-halpin-cycle)"
                    : isBranch
                      ? "url(#arrow-halpin-branch)"
                      : "url(#arrow-halpin)"
                }
              />
              {isBranch && (
                <g>
                  <rect
                    x={path.mx - 18}
                    y={path.my - 9}
                    width={36}
                    height={16}
                    rx={3}
                    fill="white"
                    stroke="#8b5a2b"
                    strokeWidth={1}
                    opacity={0.95}
                  />
                  <text
                    x={path.mx}
                    y={path.my + 3}
                    textAnchor="middle"
                    fill="#8b5a2b"
                    style={{ fontSize: 10, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}
                  >
                    p={link.probability}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {model.nodes.map((node) => (
          <NodeShape
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={() => selectNode(node.id)}
          />
        ))}

        {/* Arrow legend — always with visible arrowheads */}
        <g transform={`translate(16, ${height - 40})`}>
          <line
            x1={0}
            y1={10}
            x2={36}
            y2={10}
            stroke="var(--diagram-ink)"
            strokeWidth={1.85}
            markerEnd="url(#arrow-halpin)"
          />
          <text x={44} y={13} fill="var(--diagram-ink)" style={{ fontSize: 10, fontFamily: "Georgia, serif" }}>
            Forward (solid black + tip)
          </text>
          <line
            x1={200}
            y1={10}
            x2={236}
            y2={10}
            stroke="var(--primary)"
            strokeWidth={2.15}
            strokeDasharray="7 4"
            markerEnd="url(#arrow-halpin-cycle)"
          />
          <text x={244} y={13} fill="var(--diagram-ink)" style={{ fontSize: 10, fontFamily: "Georgia, serif" }}>
            Return (dashed gold + tip)
          </text>
        </g>
      </svg>
        </div>
      </div>
    </div>
  );
}
