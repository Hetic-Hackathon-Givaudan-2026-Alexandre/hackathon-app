import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Détecteur de tendances',
  description: 'Radar des tendances alimentaires et olfactives — Givaudan',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
