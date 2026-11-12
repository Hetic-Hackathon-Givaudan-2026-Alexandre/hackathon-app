import Link from 'next/link';
import { notFound } from 'next/navigation';
import BoutonSuivre from '@/app/components/BoutonSuivre';
import Courbe from '@/app/components/Courbe';
import Explication from '@/app/components/Explication';
import Globe from '@/app/components/Globe';
import Onglets from '@/app/components/Onglets';
import {
  AnneauScore,
  BadgeEtat,
  Pastille,
  Variation,
} from '@/app/components/ui';
import { type Arome, proposition } from '@/lib/catalogue';
import { nomPays } from '@/lib/pays';
import {
  etat,
  getTrend,
  METIERS,
  moisCourbe,
  type Trend,
  variation,
  variation12Mois,
} from '@/lib/trends';

export const dynamic = 'force-dynamic';

const CYCLE = ['Émergence', 'Croissance', 'Maturité', 'Déclin'] as const;

/** Étape du cycle de vie, déduite du score, des critères et de la variation. */
function etapeCycle(trend: Trend) {
  if (trend.score_veille === null) return 0;
  if (etat(trend.score) === 'buzz' || (variation(trend) ?? 0) <= -5) return 3;
  if (trend.evolution >= 70) return 1;
  return 2;
}

/** Sources réelles à consulter (recherches en direct, rien d'inventé). */
function sources(trend: Trend) {
  const q = encodeURIComponent(trend.nom.split(' :')[0].replace(/[«»]/g, ''));
  return [
    {
      titre: 'Intérêt de recherche sur 5 ans',
      site: 'Google Trends',
      url: `https://trends.google.com/trends/explore?date=today%205-y&q=${q}`,
    },
    {
      titre: 'Articles de presse récents',
      site: 'Google News',
      url: `https://news.google.com/search?q=${q}&hl=fr`,
    },
    {
      titre: 'Discussions des consommateurs',
      site: 'Reddit',
      url: `https://www.reddit.com/search/?q=${q}`,
    },
  ];
}

export default async function FicheTendance({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trend = await getTrend(id);
  if (!trend) notFound();

  const p = await proposition(trend);
  const e = etat(trend.score);
  const etape = etapeCycle(trend);
  const liens = sources(trend);
  const courbe = trend.courbe.map((valeur, i) => ({
    mois: moisCourbe(i),
    valeur,
  }));

  const criteres = [
    {
      nom: 'Évolution',
      valeur: trend.evolution,
      aide: 'La courbe monte-t-elle sur 12 mois ?',
    },
    {
      nom: 'Récurrence',
      valeur: trend.recurrence,
      aide: 'Revient-elle chaque année, ou une seule fois ?',
    },
    {
      nom: 'Diffusion',
      valeur: trend.diffusion,
      aide: 'Dans combien de pays monte-t-elle ?',
    },
  ];

  const decision = (
    <div className="space-y-5">
      <section aria-labelledby="score" className="verre p-6">
        <h2 id="score" className="text-lg font-medium">
          Score de durabilité
        </h2>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col items-center gap-2">
            <AnneauScore score={trend.score} etat={e} />
            <div className="flex items-center gap-2">
              <BadgeEtat etat={e} />
              <Variation valeur={variation(trend)} />
            </div>
          </div>
          <dl className="flex-1 space-y-4">
            {criteres.map((c) => (
              <div key={c.nom}>
                <div className="flex justify-between text-sm">
                  <dt className="font-medium">{c.nom}</dt>
                  <dd className="tabular-nums">{c.valeur}/100</dd>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-lueur shadow-[0_0_8px_var(--color-lueur)]"
                    style={{ width: `${c.valeur}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-brume">{c.aide}</p>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-6 border-t border-bord pt-4">
          <Explication trendId={trend.id} />
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {liens.slice(0, 2).map((s) => (
              <a
                key={s.site}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-lueur underline-offset-4 hover:underline"
              >
                {s.site} ↗
              </a>
            ))}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="proposer"
        className="verre p-6 ring-1 ring-givaudan/40"
      >
        <h2 id="proposer" className="text-lg font-medium">
          Ce que Givaudan peut proposer
        </h2>

        <div className="mt-4 rounded-2xl bg-white/[0.04] p-4">
          {p.auCatalogue ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-lueur/15 px-3 py-1 text-sm font-medium text-lueur">
                  Au catalogue
                </span>
                <span className="font-medium">{p.auCatalogue.nom}</span>
                <span className="text-sm text-brume">
                  réf. {p.auCatalogue.ref}
                </span>
                <span className="ml-auto text-sm">
                  Délai : environ <strong>{p.delaiMois} mois</strong>
                </span>
              </div>
              <Matiere arome={p.auCatalogue} />
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-ambre/15 px-3 py-1 text-sm font-medium text-ambre">
                À créer
              </span>
              <span className="text-brume">
                Aucun arôme du catalogue ne correspond encore.
              </span>
              <span className="ml-auto text-sm">
                Délai : environ <strong>{p.delaiMois} mois</strong>
              </span>
            </div>
          )}
        </div>

        <h3 className="mt-6 text-sm font-medium text-brume">
          Alternatives du catalogue, par similarité
        </h3>
        <ol className="mt-3 space-y-3">
          {p.alternatives.map((a) => (
            <li key={a.arome.ref} className="rounded-2xl bg-white/[0.04] p-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-medium">{a.arome.nom}</span>
                <span className="text-sm text-brume">réf. {a.arome.ref}</span>
                <span className="ml-auto flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-20 rounded-full bg-white/10">
                    <span
                      className="block h-1.5 rounded-full bg-lueur"
                      style={{ width: `${a.proximite}%` }}
                    />
                  </span>
                  <span className="tabular-nums">{a.proximite} %</span>
                </span>
              </div>
              <p className="mt-1 text-sm text-texte/80">
                En commun : {a.notesCommunes.join(', ')}. {a.arome.description}
              </p>
              <Matiere arome={a.arome} />
            </li>
          ))}
        </ol>

        <h3 className="mt-6 text-sm font-medium text-brume">
          Une piste produit par métier
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {p.pistes.map((piste) => (
            <li
              key={piste.metier}
              className="rounded-2xl bg-white/[0.04] p-4 text-sm"
            >
              <span className="text-brume">{METIERS[piste.metier]}</span>
              <p className="mt-1">{piste.idee}</p>
            </li>
          ))}
        </ul>

        <Link
          href={`/tendance/${trend.id}/piste`}
          className="mt-6 inline-flex rounded-full bg-givaudan px-6 py-3 font-medium text-white hover:bg-givaudan/90"
        >
          Proposer la piste
        </Link>
      </section>
    </div>
  );

  const signaux = (
    <div className="space-y-5">
      <section aria-labelledby="courbe" className="verre p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="courbe" className="text-lg font-medium">
            Intérêt de recherche sur 5 ans
          </h2>
          <p className="text-sm text-brume">
            <span className="text-lueur">
              {variation12Mois(trend) >= 0 ? '+' : ''}
              {variation12Mois(trend)} %
            </span>{' '}
            sur 12 mois
          </p>
        </div>
        <p className="text-xs text-brume">
          Courbe simulée au format Google Trends (indice 0 à 100), en attendant
          l&apos;export de l&apos;équipe Data.
        </p>
        <div className="mt-4">
          <Courbe points={courbe} />
        </div>
      </section>

      <section aria-labelledby="sources" className="verre p-6">
        <h2 id="sources" className="text-lg font-medium">
          Sources
        </h2>
        <ul className="mt-3 divide-y divide-bord">
          {liens.map((s) => (
            <li key={s.site}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 py-3 hover:text-lueur"
              >
                <span>
                  <span className="block">{s.titre}</span>
                  <span className="text-sm text-brume">
                    {s.site}, recherche en direct
                  </span>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-brume hover:text-texte">
        ← Fil du jour
      </Link>

      <header className="mt-5 flex flex-wrap items-center gap-5">
        <Pastille emoji={trend.emoji} taille="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-normal sm:text-5xl">{trend.nom}</h1>
            <BadgeEtat etat={e} />
          </div>
          <p className="mt-1 text-brume">
            {METIERS[trend.metier]}, {trend.categories.join(', ')}. En hausse :{' '}
            {trend.pays.map(nomPays).join(', ')}.
          </p>
        </div>
        <BoutonSuivre id={trend.id} />
      </header>

      <p className="mt-4 max-w-3xl text-lg text-texte/85">
        {trend.description}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Onglets decision={decision} signaux={signaux} />

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="cycle" className="verre p-5">
            <h2 id="cycle" className="text-sm font-medium text-brume">
              Cycle de vie
            </h2>
            <ol className="mt-4 grid grid-cols-4 text-center text-xs">
              {CYCLE.map((nom, i) => (
                <li key={nom} className="relative">
                  <span
                    className={`mx-auto block h-3.5 w-3.5 rounded-full border-2 ${
                      i === etape
                        ? 'border-lueur bg-lueur shadow-[0_0_12px_var(--color-lueur)]'
                        : i < etape
                          ? 'border-lueur bg-lueur/40'
                          : 'border-white/30'
                    }`}
                  />
                  <span
                    className={`mt-2 block ${i === etape ? 'text-texte' : 'text-brume'}`}
                    aria-current={i === etape ? 'step' : undefined}
                  >
                    {nom}
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <div className="apparition">
            <Globe
              points={trend.pays.map((pays, i) => ({
                pays,
                intensite: i === 0 ? 1 : 0.55,
              }))}
              arcsDepuis={trend.pays[0]}
              centre={trend.pays[0]}
              etiquettes={[
                {
                  pays: trend.pays[0],
                  titre: trend.nom,
                  sousTitre: `origine : ${nomPays(trend.pays[0])}`,
                },
              ]}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

/** F6 : disponibilité, coût, récolte et risque de la matière première. */
function Matiere({ arome }: { arome: Arome }) {
  const couleur = {
    disponible: 'text-lueur',
    tendue: 'text-ambre',
    rare: 'text-alerte',
  }[arome.disponibilite];
  const cout = { stable: 'stable', hausse: 'en hausse', baisse: 'en baisse' }[
    arome.cout
  ];
  return (
    <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2 text-xs">
      <div>
        <dt className="text-brume">Disponibilité</dt>
        <dd className={`font-medium capitalize ${couleur}`}>
          {arome.disponibilite}
        </dd>
      </div>
      <div>
        <dt className="text-brume">Coût</dt>
        <dd className="font-medium">{cout}</dd>
      </div>
      <div>
        <dt className="text-brume">Récolte</dt>
        <dd className="font-medium">{arome.recolte}</dd>
      </div>
      <div className="col-span-full flex gap-2">
        <dt className="text-brume">Risque :</dt>
        <dd>{arome.risque}</dd>
      </div>
    </dl>
  );
}
