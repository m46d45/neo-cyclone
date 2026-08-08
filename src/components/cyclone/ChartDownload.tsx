import { useRef } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadChartContainerAsPng, safeFilename } from "@/lib/cyclone/export-utils";
import { cn } from "@/lib/utils";

/**
 * Chart shell with PNG download only (no zoom).
 * Wrap any Recharts chart so the SVG can be exported.
 */
export function ChartDownloadFrame({
  title,
  filename,
  className,
  chartClassName,
  children,
}: {
  title?: string;
  filename: string;
  className?: string;
  chartClassName?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  async function onDownload() {
    const el = ref.current;
    if (!el) return;
    try {
      await downloadChartContainerAsPng(el, safeFilename(filename, "png"));
      toast.success("Chart PNG downloaded");
    } catch {
      toast.error("Could not download chart");
    }
  }

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        {title ? (
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h4>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 px-2 text-[10px]"
          onClick={onDownload}
          title="Download chart as PNG"
        >
          <Download className="size-3" />
          PNG
        </Button>
      </div>
      <div ref={ref} className={cn("w-full min-w-0", chartClassName)}>
        {children}
      </div>
    </div>
  );
}
