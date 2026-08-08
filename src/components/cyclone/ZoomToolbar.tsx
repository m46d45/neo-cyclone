import { useState } from "react";
import { Download, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ZoomToolbarProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onDownload?: () => void;
  downloadLabel?: string;
  className?: string;
  minZoom?: number;
  maxZoom?: number;
};

export function ZoomToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onDownload,
  downloadLabel = "PNG",
  className,
  minZoom = 0.5,
  maxZoom = 2.5,
}: ZoomToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-background/95 p-0.5 shadow-sm",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={onZoomOut}
        disabled={zoom <= minZoom + 0.01}
        title="Zoom out"
        aria-label="Zoom out"
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="min-w-[2.75rem] text-center font-mono text-[10px] tabular-nums text-muted-foreground">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom - 0.01}
        title="Zoom in"
        aria-label="Zoom in"
      >
        <Plus className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={onZoomReset}
        title="Reset zoom"
        aria-label="Reset zoom"
      >
        <RotateCcw className="size-3.5" />
      </Button>
      {onDownload && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-0.5 h-7 gap-1 px-2 text-[10px]"
          onClick={onDownload}
          title="Download as PNG"
        >
          <Download className="size-3" />
          {downloadLabel}
        </Button>
      )}
    </div>
  );
}

export function useZoomState(initial = 1, step = 0.25, min = 0.5, max = 2.5) {
  const [zoom, setZoom] = useState(initial);
  return {
    zoom,
    minZoom: min,
    maxZoom: max,
    zoomIn: () => setZoom((z) => Math.min(max, Math.round((z + step) * 100) / 100)),
    zoomOut: () => setZoom((z) => Math.max(min, Math.round((z - step) * 100) / 100)),
    zoomReset: () => setZoom(initial),
  };
}
