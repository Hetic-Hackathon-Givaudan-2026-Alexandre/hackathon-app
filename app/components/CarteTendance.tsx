import Link from 'next/link';
import { BadgeEtat, Pastille, Variation } from '@/app/components/ui';
import { etat, METIERS, type Trend, variation } from '@/lib/modele';

/** Carte d'une tendance (fil du jour, recherche, mes tendances). */
export default function CarteTendance({
  trend,
  suivie = false,
  raison,
}: {
  trend: Trend;
  suivie?: boolean;
  /** Pourquoi elle correspond à la recherche du client */
  raison?: string;
}) {
  return (
    <Link
      href={`/tendance/${trend.id}`}
      className="verre group flex flex-col gap-4 p-5 transition-colors hover:bg-verre-fort"
    >
      <div className="flex items-start gap-4">
        <Pastille emoji={trend.emoji} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-medium">{trend.nom}</h3>
            {suivie && (
              <span className="rounded-full bg-ambre/15 px-2 py-0.5 text-xs text-ambre ring-1 ring-ambre/30">
                ★ Favori
              </span>
            )}
          </div>
          <p className="text-sm text-brume">
            {METIERS[trend.metier]}, {trend.categories.slice(0, 2).join(', ')}
          </p>
        </div>
        <Variation valeur={variation(trend)} />
      </div>

      {raison && <p className="text-sm text-texte/85">{raison}</p>}

      <div className="mt-auto flex items-center justify-between">
        <BadgeEtat etat={etat(trend.score)} />
        <span className="text-sm text-brume">
          Score{' '}
          <strong className="text-base font-semibold text-texte tabular-nums">
            {trend.score}
          </strong>
          /100
        </span>
      </div>
    </Link>
  );
}
