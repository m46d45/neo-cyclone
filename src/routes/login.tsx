import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="halpin-shell grid min-h-dvh place-items-center px-4 pt-[var(--grok-banner-h,0px)]">
      <Card className="w-full max-w-sm border-primary/25">
        <CardHeader>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            Neo-CYCLONE
          </p>
          <CardTitle className="font-display">Sign in</CardTitle>
          <CardDescription>Optional — the studio works without an account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}
          <Button asChild variant="outline" className="w-full border-primary/30">
            <Link to="/">Back to studio</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
