import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { researchAreas } from "@/data/research";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { LenisProvider } from "@/components/lenis-provider";
import { RouteTransition } from "@/components/route-transition";
import { SkipLink } from "@/components/skip-link";
import { CookieBanner } from "@/components/cookie-banner";
import { GoTop } from "@/components/go-top";
import { FloatingContact } from "@/components/floating-contact";
import { UtmCapture } from "@/components/utm-capture";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.bio,
  keywords: [
    "Samvrit Srinath",
    "software engineer",
    "researcher",
    "systems",
    "internet measurement",
    "machine learning",
    "UC San Diego",
  ],
  openGraph: {
    title: `${site.name} · ${site.tagline}`,
    description: site.bio,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.tagline}`,
    description: site.bio,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const papers = [
    ...projects.flatMap((p) => (p.paper ? [p.paper] : [])),
    ...researchAreas.flatMap((a) => a.papers),
  ];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      url: site.url,
      jobTitle: "Software Engineer",
      sameAs: [site.contact.github, site.contact.linkedin],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}/work/${p.slug}`,
        name: p.title,
      })),
    },
    ...papers.map((paper) => ({
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      headline: paper.title,
      publisher: paper.venue,
      datePublished: paper.year,
      url: paper.href.startsWith("http") ? paper.href : `${site.url}${paper.href}`,
    })),
  ];
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head />
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans`}>
        {/* Both component scripts live in the body, and nothing positional is
            left in head. An extension that prepends nodes to head shifts a
            positional inline script by one and desynchronises hydration; with an
            empty head there is nothing left to shift. The theme script is raw
            rather than next/script because next/script's beforeInteractive does
            not execute at parse time: in the shipped HTML it only pushes an
            entry onto self.__next_s for the client runtime to drain later, which
            is both the positional node and a post-hydration flash of light mode.
            A raw inline script at body top runs during parse, ahead of every
            framework bundle. */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t;try{t=localStorage.getItem('theme')}catch(e){}if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {/* JSON-LD sits in the body by Next.js convention. Keeping it out of
            head leaves head with a single managed script, so an extension that
            prepends nodes to head cannot shift a positional inline script by
            one and desynchronise hydration. */}
        <script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          <SkipLink />
          <ScrollProgress />
          <Nav />
          <RouteTransition>{children}</RouteTransition>
          <Footer />
          <CookieBanner />
          <GoTop />
          <FloatingContact />
          <UtmCapture />
          <Analytics />
          <SpeedInsights />
        </LenisProvider>
      </body>
    </html>
  );
}
