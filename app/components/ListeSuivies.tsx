'use client';

import Link from 'next/link';
import CarteTendance from '@/app/components/CarteTendance';
import type { Trend } from '@/lib/modele';
import { useSuivies } from '@/lib/suivi';

export default function ListeSuivies({ trends }: { trends: Trend[] }) {
  const { ids } = useSuivies();
  const suivies = trends.filter((t) => ids.includes(t.id));
  if (!suivies.length) {
    return (
      <p className="verre p-6 text-brume">
        Vous ne suivez encore aucune tendance.{' '}
        <Link href="/" className="text-texte underline">
          Voir le fil du jour
        </Link>
      </p>
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {suivies.map((t) => (
        <li key={t.id} className="flex [&>a]:flex-1">
          <CarteTendance trend={t} suivie />
        </li>
      ))}
    </ul>
  );
}
