import { getTrends, scoreTrend } from '@/lib/trends';

const couleurs: Record<string, string> = {
  'tendance durable': 'bg-emerald-100 text-emerald-800',
  'à surveiller': 'bg-amber-100 text-amber-800',
  buzz: 'bg-rose-100 text-rose-800',
};

export default function Home() {
  const items = getTrends()
    .map((trend) => ({ trend, score: scoreTrend(trend) }))
    .sort((a, b) => b.score.total - a.score.total);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
        Givaudan · Radar
      </p>
      <h1 className="mt-2 text-3xl font-bold">Détecteur de tendances</h1>
      <p className="mt-2 text-stone-600">
        Tendances classées par score : buzz ou tendance durable. Données
        simulées pour le prototype.
      </p>

      <ul className="mt-8 space-y-4">
        {items.map(({ trend, score }) => (
          <li
            key={trend.id}
            className="rounded-xl border border-stone-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{trend.nom}</h2>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${couleurs[score.verdict]}`}
              >
                {score.verdict} · {score.total}/100
              </span>
            </div>
            <p className="mt-1 text-stone-600">{trend.description}</p>
            <p className="mt-3 text-sm text-stone-500">
              {trend.categorie} · {trend.sources.length} sources ·{' '}
              {trend.pays.length} pays
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
