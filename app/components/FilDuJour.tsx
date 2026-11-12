'use client';

import Link from 'next/link';
import CarteTendance from '@/app/components/CarteTendance';
import { type Trend, variation } from '@/lib/modele';
import { useSuivies } from '@/lib/suivi';

/**
 * Ce qui a bougé depuis hier. Ordre (document Product, F1) : les tendances
 * suivies qui ont bougé, puis les nouvelles, puis les autres mouvements.
 */
export default function FilDuJour({ trends }: { trends: Trend[] }) {
  const { ids } = useSuivies();
  const ampleur = (t: Trend) => Math.abs(variation(t) ?? 0);
  const aBouge = (t: Trend) => variation(t) !== 0;

  const suiviesBougees = trends
    .filter((t) => ids.includes(t.id) && aBouge(t) && t.score_veille !== null)
    .sort((a, b) => ampleur(b) - ampleur(a));
  const nouvelles = trends.filter((t) => t.score_veille === null);
  const autres = trends
    .filter(
      (t) =>
        t.score_veille !== null && aBouge(t) && !suiviesBougees.includes(t),
    )
    .sort((a, b) => ampleur(b) - ampleur(a));
  const fil = [...suiviesBougees, ...nouvelles, ...autres];

  if (!fil.length) {
    const suivies = trends.filter((t) => ids.includes(t.id));
    return (
      <div>
        <p className="verre p-6 text-brume">Rien de nouveau depuis hier.</p>
        <Grille trends={suivies} ids={ids} />
      </div>
    );
  }
  return <Grille trends={fil} ids={ids} />;
}

function Grille({ trends, ids }: { trends: Trend[]; ids: string[] }) {
  if (!trends.length) {
    return (
      <p className="text-brume">
        Aucune tendance à afficher.{' '}
        <Link href="/" className="underline">
          Revenir au fil
        </Link>
      </p>
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {trends.map((t) => (
        <li key={t.id} className="flex">
          <div className="flex w-full flex-col [&>a]:flex-1">
            <CarteTendance trend={t} suivie={ids.includes(t.id)} />
          </div>
        </li>
      ))}
    </ul>
  );
}
