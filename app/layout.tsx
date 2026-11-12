import '@fontsource-variable/jost';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trend Intelligence — Givaudan',
  description:
    'Détecter les tendances durables et trouver le produit Givaudan à proposer.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="min-h-screen overflow-x-hidden antialiased">
        <header className="sticky top-0 z-30 bg-espace/60 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-4">
              <span className="text-2xl font-normal tracking-wide">
                Givaudan
              </span>
              <span className="hidden h-7 w-px bg-bord sm:block" />
              <span className="hidden text-texte/85 sm:block">
                Trend Intelligence
              </span>
            </Link>
            <Navigation />
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/recherche"
                aria-label="Rechercher pour un client"
                className="flex h-11 w-11 items-center justify-center rounded-full text-texte/85 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </Link>
              <Link
                href="/#fil"
                aria-label="Ce qui a bougé depuis hier"
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-texte/85 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
                </svg>
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-lueur shadow-[0_0_8px_var(--color-lueur)]" />
              </Link>
              <span
                title="Camille, cheffe de produit (démo)"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-medium"
              >
                CM
              </span>
            </div>
          </div>
        </header>
        {children}
        <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-brume sm:px-6">
          Prototype G16 : toutes les données (tendances, scores, catalogue
          d&apos;arômes) sont simulées. Textures du globe : NASA Visible Earth
          (domaine public).
        </footer>
      </body>
    </html>
  );
}
