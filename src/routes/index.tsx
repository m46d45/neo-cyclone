import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { AIAssist } from "@/components/cyclone/AIAssist";
import { DiagramCanvas } from "@/components/cyclone/DiagramCanvas";
import { ModelSimulateBar } from "@/components/cyclone/ModelSimulateBar";
import { NetworkLogic } from "@/components/cyclone/NetworkLogic";
import { ResultsPanel } from "@/components/cyclone/ResultsPanel";
import { LogoMark } from "@/components/cyclone/LogoMark";
import { PRODUCT_TAGLINE } from "@/lib/cyclone/prompt-template";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: StudioPage });

function StudioPage() {
  const { isPending } = useCurrentUserState();

  return (
    <div className="halpin-shell min-h-dvh overflow-x-hidden text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md pt-[var(--grok-banner-h,0px)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark className="size-9 shrink-0" />
            <div className="min-w-0">
              <h1 className="font-display truncate text-base font-semibold tracking-tight">
                Neo-CYCLONE
              </h1>
              <p className="truncate text-xs text-muted-foreground">{PRODUCT_TAGLINE}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/manual">
                <BookOpen className="size-3.5" />
                Manual
              </Link>
            </Button>
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : (
              <>
                <SignedOut>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Sign in</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </>
            )}
          </div>
        </div>
        <div className="gold-rule" />
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
        {/* Top: Prompt | Model */}
        <div className="grid items-stretch gap-4 lg:grid-cols-12">
          <section className="flex min-w-0 flex-col lg:col-span-5">
            <AIAssist />
          </section>

          <section className="min-w-0 space-y-3 lg:col-span-7">
            <div>
              <h2 className="mb-2 font-display text-sm font-semibold">CYCLONE Model</h2>
              <div className="h-[min(52vh,480px)] min-h-[280px] w-full min-w-0">
                <DiagramCanvas />
              </div>
            </div>
            <NetworkLogic />
            <ModelSimulateBar />
          </section>
        </div>

        {/* Full-width Results under both columns */}
        <div className="mt-4 min-w-0">
          <ResultsPanel />
        </div>

        <footer className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {PRODUCT_TAGLINE} ·{" "}
          <Link to="/manual" className="text-primary hover:underline">
            Manual
          </Link>
        </footer>
      </main>
    </div>
  );
}
