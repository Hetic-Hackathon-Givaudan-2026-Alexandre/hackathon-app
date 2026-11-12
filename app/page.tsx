import BarreRecherche from '@/app/components/BarreRecherche';
import FilDuJour from '@/app/components/FilDuJour';
import Globe, { type PointGlobe } from '@/app/components/Globe';
import { etat, getTrends, resumeDuJour, variation } from '@/lib/trends';

// Lu à chaque requête depuis PostgreSQL (pas au moment du build)
export const dynamic = 'force-dynamic';

export default async function Accueil() {
  const trends = await getTrends();
  const resume = resumeDuJour(trends);
  const durables = trends.filter((t) => etat(t.score) === 'durable').length;
  const hausses = trends.filter((t) => (variation(t) ?? 0) > 0).length;
  const nouvelles = trends.filter((t) => t.score_veille === null).length;

  // Intensité d'un pays : nombre de tendances qui y montent
  const parPays = new Map<string, number>();
  for (const t of trends) {
    for (const p of t.pays) parPays.set(p, (parPays.get(p) ?? 0) + 1);
  }
  const max = Math.max(...parPays.values());
  const points: PointGlobe[] = [...parPays].map(([pays, n]) => ({
    pays,
    intensite: n / max,
  }));
  const yuzu = trends.find((t) => t.id === 'yuzu');

  const aujourdhui = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="grid items-center gap-8 py-10 lg:grid-cols-[1fr_1.1fr] lg:py-14">
        <div>
          <p className="text-brume first-letter:uppercase">{aujourdhui}</p>
          <h1 className="mt-3 text-4xl leading-tight font-normal sm:text-6xl">
            Ce qui a bougé depuis hier
          </h1>

          {resume.length > 0 && (
            <div className="verre mt-6 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-lueur">
                <span aria-hidden="true">✦</span> Résumé du jour
              </p>
              <ul className="mt-2 space-y-1.5 text-texte/90">
                {resume.map((phrase) => (
                  <li key={phrase}>{phrase}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 text-sm text-brume">
              Un client vous sollicite ? Décrivez sa demande.
            </p>
            <BarreRecherche grande />
          </div>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-bord">
            <Chiffre valeur={trends.length} libelle="tendances analysées" />
            <Chiffre valeur={durables} libelle="durables" />
            <Chiffre
              valeur={`${hausses} / ${nouvelles}`}
              libelle="en hausse / nouvelles"
            />
          </dl>
        </div>

        <div className="apparition relative mx-auto w-full max-w-[640px]">
          <div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(60_130_220/0.25),transparent_65%)] blur-2xl"
          />
          <Globe
            points={points}
            arcsDepuis="JP"
            centre="JP"
            etiquettes={
              yuzu
                ? [
                    {
                      pays: 'JP',
                      titre: 'Yuzu',
                      sousTitre: `+${variation(yuzu)} aujourd'hui`,
                    },
                  ]
                : []
            }
          />
        </div>
      </section>

      <section aria-labelledby="fil" className="pb-6">
        <h2 id="fil" className="mb-5 text-2xl font-normal">
          Fil du jour
        </h2>
        <FilDuJour trends={trends} />
      </section>
    </main>
  );
}

function Chiffre({
  valeur,
  libelle,
}: {
  valeur: number | string;
  libelle: string;
}) {
  return (
    <div className="flex flex-col-reverse px-4 first:pl-0">
      <dt className="text-sm text-brume">{libelle}</dt>
      <dd className="text-3xl font-normal tabular-nums">{valeur}</dd>
    </div>
  );
}
