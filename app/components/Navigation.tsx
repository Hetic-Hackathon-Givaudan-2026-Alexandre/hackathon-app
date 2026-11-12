'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSuivies } from '@/lib/suivi';

/** Les 3 entrées du header : fil du jour, mes tendances, recherche. */
export default function Navigation() {
  const chemin = usePathname();
  const { ids } = useSuivies();
  const liens = [
    { href: '/', libelle: 'Fil du jour', actif: chemin === '/' },
    {
      href: '/suivies',
      libelle: `Mes tendances${ids.length ? ` (${ids.length})` : ''}`,
      actif: chemin === '/suivies',
    },
  ];
  return (
    <nav
      aria-label="Navigation principale"
      className="flex rounded-full border border-bord bg-white/[0.04] p-1"
    >
      {liens.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={l.actif ? 'page' : undefined}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            l.actif ? 'bg-white/15 text-texte' : 'text-brume hover:text-texte'
          }`}
        >
          {l.libelle}
        </Link>
      ))}
    </nav>
  );
}
