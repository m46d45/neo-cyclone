import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { CreatedWithGrokBanner } from "@/components/created-with-grok-banner";
import appCss from "../styles.css?url";

const APP_NAME = "Neo-CYCLONE";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host
  ? `https://og.grok.me/v1/card.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_NAME)}`
  : undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Neo-CYCLONE — AI-agent of Daniel W. Halpin's CYCLONE. Construction operation simulation with Activity Cycle Diagrams.",
      },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: "#ffffff" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <CreatedWithGrokBanner />
          <Outlet />
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast:
                  "border border-[#e0d8c8] bg-[#faf8f4] text-[#0b0b0a] shadow-md",
                title: "text-[#0b0b0a] font-medium",
                description: "text-[#5c564a]",
                success:
                  "!border-[#b89b5e]/70 !bg-[#f5efe3] !text-[#0b0b0a] [&_[data-icon]]:!text-[#b89b5e]",
                error:
                  "!border-[#b54a3c]/50 !bg-[#faf6f4] !text-[#0b0b0a] [&_[data-icon]]:!text-[#b54a3c]",
                info: "!border-[#e0d8c8] !bg-[#faf8f4] !text-[#0b0b0a] [&_[data-icon]]:!text-[#b89b5e]",
                warning:
                  "!border-[#b89b5e]/50 !bg-[#f7f0e0] !text-[#0b0b0a] [&_[data-icon]]:!text-[#8b7355]",
              },
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
