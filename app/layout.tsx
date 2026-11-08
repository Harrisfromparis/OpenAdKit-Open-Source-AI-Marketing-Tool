import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { StatusBar } from "@/components/StatusBar";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { CommandPalette } from "@/components/CommandPalette";
import { UndoToast } from "@/components/UndoToast";
import { LocalSyncBoot } from "@/components/LocalSyncBoot";
import { VaultGate } from "@/components/VaultGate";

// Autism & Me brand kit: Atkinson Hyperlegible for body text, Poppins for
// headings. The "mono" label style also uses Poppins so the UI stays on brand.
// Self-hosted (SIL Open Font Licence, files in app/fonts) so no font
// request ever goes to a third party.
const sans = localFont({
  src: [
    { path: "./fonts/atkinson-hyperlegible-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/atkinson-hyperlegible-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const display = localFont({
  src: [
    { path: "./fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});
const mono = localFont({
  src: [
    { path: "./fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const SEO_DESCRIPTION =
  "Autism & Me Ad Studio: a private workspace for planning, writing and checking ads for Meta and other platforms. Built on OpenAdKit (MIT).";

/**
 * Canonical origin for OG images, canonicals and JSON-LD.
 *
 * Hardcoding the author's domain meant every self-hosted deployment and every
 * fork emitted OG/canonical URLs pointing back at openadkit.dicecodes.com —
 * so shared links previewed someone else's site, and canonicals told search
 * engines the fork was a duplicate. Resolve from the environment, falling back
 * to the public instance for the canonical deploy.
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "") ||
  "https://autismandme-ad-studio.vercel.app"
).replace(/\/+$/, "");

/** Kept in sync with package.json — this shipped as "0.1.0" long after 1.0.0. */
const APP_VERSION = "1.1.0";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ad Studio · Autism & Me",
    template: "%s · Ad Studio · Autism & Me",
  },
  description: SEO_DESCRIPTION,
  applicationName: "Autism & Me Ad Studio",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/icon-192.png",
  },
  // A private working tool: keep it out of search engines.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#05222B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IE" className={`dark ${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        {/* Skip-to-content for keyboard + screen-reader users — visually
            hidden until focused, then jumps past the sidebar / mobile nav. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-base-900 focus:text-ink focus:px-3 focus:py-2 focus:border focus:border-live"
        >
          Skip to main content
        </a>
        {/* App shell: the viewport is the frame, and the two panes scroll
            independently inside it.

            `h-dvh overflow-hidden` pins the shell to exactly one screen so the
            PAGE never scrolls. The sidebar owns its own scrollbar (see
            Sidebar's <nav>) and the main canvas owns its own (#main-scroll
            below), which means the nav stays put while you read a long
            generation, and scrolling a 12-item nav group doesn't drag the
            content with it. Previously `min-h-screen` let the whole document
            grow, so the sidebar scrolled off the top of the page and its
            `flex-1 overflow-y-auto` never actually engaged.

            dvh (not vh) so mobile browser chrome collapsing doesn't leave a
            dead strip under the status bar. */}
        <div className="flex h-dvh overflow-hidden">
          <Sidebar />
          <MobileNav />
          <ServiceWorkerRegister />
          <LocalSyncBoot />
          <CommandPalette />
          <UndoToast />
          <main id="main-content" className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <VaultGate />
            <div id="main-scroll" className="flex-1 overflow-y-auto overscroll-contain px-4 md:px-10 pt-14 md:pt-6 pb-10">
              {children}
            </div>
            <StatusBar />
          </main>
        </div>
      </body>
    </html>
  );
}
