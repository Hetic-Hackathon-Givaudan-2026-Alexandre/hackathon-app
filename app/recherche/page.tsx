import Link from 'next/link';
import BarreRecherche from '@/app/components/BarreRecherche';
import CarteTendance from '@/app/components/CarteTendance';
import { rechercher } from '@/lib/recherche';
import { getTrends } from '@/lib/trends';

export const dynamic = 'force-dynamic';

export default async function Recherche({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim() ?? '';
  const { resultats, source } = q
    ? await rechercher(q, await getTrends())
    : { resultats: [], source: 'mots-cles' as const };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-brume hover:text-texte">
        ← Fil du jour
      </Link>
      <h1 className="mt-4 text-4xl font-normal">Recherche pour un client</h1>
      <div className="mt-6 max-w-2xl">
        <BarreRecherche valeur={q} grande />
      </div>

      {q && (
        <section aria-live="polite" className="mt-10">
          {resultats.length ? (
            <>
              <p className="mb-5 text-brume">
                {resultats.length} tendance{resultats.length > 1 ? 's' : ''}{' '}
                pour « {q} », de la plus pertinente à la moins pertinente.{' '}
                <span className="text-sm">
                  {source === 'ia'
                    ? '✦ Classées par l’IA.'
                    : 'Classées par correspondance des mots.'}
                </span>
              </p>
              <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {resultats.map(({ trend, raison }) => (
                  <li key={trend.id} className="flex [&>a]:flex-1">
                    <CarteTendance trend={trend} raison={raison} />
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="verre p-6 text-brume">
              Aucune tendance ne correspond, essayez avec un ingrédient ou un
              pays.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
