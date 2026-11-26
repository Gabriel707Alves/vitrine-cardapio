import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/figtree/index.css";
import "./globals.css";
import { cliente } from "@/config/cliente";
import { isDemo, siteUrl } from "@/lib/site/demo";

const titulo = `${cliente.nome}: ${cliente.slogan.charAt(0).toLowerCase()}${cliente.slogan.slice(1)}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: titulo,
  description: cliente.descricao,
  robots: isDemo() ? { index: false, follow: false } : undefined,
  openGraph: {
    title: titulo,
    description: cliente.descricao,
    type: "website",
    locale: "pt_BR",
    images: [{ url: cliente.fotos.hero.src, alt: cliente.fotos.hero.alt }],
  },
  twitter: { card: "summary_large_image" },
  other: { "site-kind": "other", "page-type": "place", "page-kind": "place" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: cliente.cores.bg,
};

const c = cliente.cores;
const tokens = `:root{--p-bg:${c.bg};--p-surface:${c.surface};--p-ink:${c.ink};--p-muted:${c.muted};--p-accent:${c.accent};--p-accent-ink:${c.accentInk};--p-action:${c.accent};--p-action-ink:${c.accentInk};--p-inv-bg:${c.invBg};--p-inv-surface:${c.invSurface};--p-inv-ink:${c.invInk};--p-inv-muted:${c.invMuted};--p-inv-accent:${c.invInk};--p-inv-accent-ink:${c.invBg};--p-inv-action:${c.invInk};--p-inv-action-ink:${c.invBg};--font-display:"Fraunces Variable","Fraunces",Georgia,serif;--font-text:"Figtree Variable","Figtree",system-ui,sans-serif;--display-weight:400;--display-tracking:-0.02em;--display-axes:'SOFT' 30,'WONK' 0}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const demo = isDemo();
  return (
    <html
      lang="pt-BR"
      data-type="place"
      data-radius="soft"
      data-buttons="solid"
      data-motion=""
      data-demo={demo ? "" : undefined}
      suppressHydrationWarning
    >
      <head>
        {/* Kit da taste-skill servido como arquivo estático (não passa pelo bundler de CSS). */}
        {/* eslint-disable @next/next/no-css-tags */}
        <link rel="stylesheet" href="/assets/system.css" />
        <link rel="stylesheet" href="/assets/ui/cards.css" />
        <link rel="stylesheet" href="/assets/motion/motion.css" />
        <link rel="stylesheet" href="/assets/layout/layout.css" />
        {/* eslint-enable @next/next/no-css-tags */}
        <style dangerouslySetInnerHTML={{ __html: tokens }} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('m-enter','mo-js');setTimeout(function(){document.documentElement.classList.add('m-enter-done')},700);setTimeout(function(){document.documentElement.classList.add('mo-safe')},2500)",
          }}
        />
      </head>
      <body>
        {/* taste-skill deal: place · palette flour-terracotta (chão de farinha e o vermelho-terracota de panela de barro) · type fraunces/figtree · hero place · nav-cards · footer-columns · rhythm colour-band · buttons solid · mark stack · oferta pair · lugar bleed · momento de tipo address · momento word-highlight */}
        {children}
        <Script type="module" src="/assets/system.js" strategy="afterInteractive" />
        <Script type="module" src="/assets/motion/motion.js" strategy="afterInteractive" />
        <Script type="module" src="/assets/layout/layout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
