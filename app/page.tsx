import BarreRecherche from '@/app/components/BarreRecherche';
import FilDuJour from '@/app/components/FilDuJour';
import Globe, { type PointGlobe } from '@/app/components/Globe';
import { etat, getTrends, resumeDuJour, variation } from '@/lib/trends';

// Lu à chaque requête depuis PostgreSQL (pas au moment du build)
export const dynamic = 'force-dynamic';

export default async function Accueil() {
  const trends = await getTrends();
  const resume = resumeDuJour(trends);

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
  const durables = trends.filter((t) => etat(t.score) === 'durable').length;
  const yuzu = trends.find((t) => t.id === 'yuzu');

  const aujourdhui = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <main>
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative z-10 max-w-xl pt-12 pb-10 lg:pt-24 lg:pb-28">
          <p className="flex items-center gap-4 text-xs tracking-[0.3em] text-brume uppercase">
            <span className="h-px w-8 bg-brume/60" />
            Tendances mondiales
          </p>
          <h1 className="mt-6 text-5xl leading-[1.08] font-light sm:text-6xl">
            Explorez les tendances à l&apos;échelle mondiale
          </h1>
          <p className="mt-6 text-lg text-texte/75">
            Analysez les signaux des réseaux sociaux, identifiez les
            opportunités et trouvez le produit Givaudan à proposer.
          </p>
          <a
            href="#fil"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-medium text-espace shadow-[0_0_40px_rgb(255_255_255/0.2)] hover:bg-white/90"
          >
            Voir ce qui a bougé
            <span aria-hidden="true">→</span>
          </a>

          <dl className="mt-14 grid grid-cols-3 divide-x divide-bord">
            <Chiffre
              icone={<path d="M3 17l6-6 4 4 8-8M15 7h6v6" />}
              valeur={String(durables)}
              libelle="Tendances durables"
            />
            <Chiffre
              icone={
                <path d="M12 3 2 8l10 5 10-5-10-5ZM2 13l10 5 10-5M2 17l10 5 10-5" />
              }
              valeur={String(trends.length)}
              libelle="Tendances suivies"
            />
            <Chiffre
              icone={
                <>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                </>
              }
              valeur={String(parPays.size)}
              libelle="Pays"
            />
          </dl>
          <p className="mt-6 text-sm text-brume">
            {trends.length} tendances suivies dans {parPays.size} pays. Glissez
            le globe pour le faire tourner.
          </p>
        </div>

        {/* La Terre déborde à droite, comme sur la maquette */}
        <div className="apparition relative -mx-4 mb-8 lg:absolute lg:top-[-1rem] lg:right-[-16%] lg:mx-0 lg:mb-0 lg:w-[54rem]">
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <section className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <div className="verre p-7">
            <p className="text-xs tracking-[0.3em] text-brume uppercase">
              {aujourdhui}
            </p>
            <h2 className="mt-3 text-3xl font-normal">
              Ce qui a bougé depuis hier
            </h2>
            <ul className="mt-5 space-y-2.5">
              {resume.map((phrase) => (
                <li key={phrase} className="flex gap-3 text-texte/90">
                  <span aria-hidden="true" className="text-lueur">
                    ✦
                  </span>
                  {phrase}
                </li>
              ))}
            </ul>
          </div>
          <div className="verre flex flex-col justify-center p-7">
            <h2 className="text-xl font-normal">Un client vous sollicite ?</h2>
            <p className="mt-1 mb-5 text-sm text-brume">
              Décrivez sa demande, l&apos;outil retrouve les tendances qui y
              répondent.
            </p>
            <BarreRecherche grande />
          </div>
        </section>

        <section aria-labelledby="fil" className="scroll-mt-24 py-12">
          <h2 id="fil" className="mb-6 text-3xl font-normal">
            Fil du jour
          </h2>
          <FilDuJour trends={trends} />
        </section>
      </div>
    </main>
  );
}

function Chiffre({
  icone,
  valeur,
  libelle,
}: {
  icone: React.ReactNode;
  valeur: string;
  libelle: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-1 px-5 first:pl-0">
      <dt className="text-sm text-brume">{libelle}</dt>
      <dd className="text-3xl font-normal tabular-nums">{valeur}</dd>
      <svg
        viewBox="0 0 24 24"
        className="mb-3 h-5 w-5 text-texte/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        {icone}
      </svg>
    </div>
  );
}
