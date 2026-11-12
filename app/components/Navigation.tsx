'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSuivies } from '@/lib/suivi';

/** Entrées du header, comme sur la maquette : Explorer, Favoris, Recherche. */
export default function Navigation() {
  const chemin = usePathname();
  const { ids } = useSuivies();
  const liens = [
    { href: '/', libelle: 'Explorer', actif: chemin === '/' },
    {
      href: '/suivies',
      libelle: 'Favoris',
      compteur: ids.length,
      actif: chemin === '/suivies',
    },
    {
      href: '/recherche',
      libelle: 'Recherche',
      actif: chemin.startsWith('/recherche'),
    },
  ];
  return (
    <nav
      aria-label="Navigation principale"
      className="flex rounded-full border border-bord bg-white/[0.04] p-1 backdrop-blur"
    >
      {liens.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={l.actif ? 'page' : undefined}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors sm:px-5 ${
            l.actif ? 'bg-white/15 text-texte' : 'text-brume hover:text-texte'
          }`}
        >
          {l.libelle}
          {l.compteur ? (
            <span className="rounded-full bg-lueur/20 px-1.5 text-xs text-lueur tabular-nums">
              {l.compteur}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
