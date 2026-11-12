import '@fontsource-variable/jost';
import type { Metadata } from 'next';
import Link from 'next/link';
import BarreRecherche from '@/app/components/BarreRecherche';
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
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-bord bg-espace/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-4">
              <span className="text-2xl font-normal tracking-wide">
                Givaudan
              </span>
              <span className="hidden h-6 w-px bg-bord sm:block" />
              <span className="hidden text-sm text-brume sm:block">
                Trend Intelligence
              </span>
            </Link>
            <Navigation />
            <div className="w-full sm:ml-auto sm:w-72">
              <BarreRecherche />
            </div>
          </div>
        </header>
        {children}
        <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-brume sm:px-6">
          Prototype G16 : toutes les données (tendances, scores, catalogue
          d&apos;arômes) sont simulées.
        </footer>
      </body>
    </html>
  );
}
