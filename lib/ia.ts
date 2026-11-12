import { pool } from '@/lib/db';
import type { Proposition } from '@/lib/catalogue';
import { nomPays } from '@/lib/pays';
import { ETATS, etat, METIERS, type Trend } from '@/lib/trends';

/**
 * Appelle l'IA (API compatible OpenAI, voir ADR 0002) et lit une réponse JSON.
 * Renvoie null en cas d'échec, de délai dépassé ou de JSON illisible :
 * chaque appelant prévoit un repli déterministe (ADR 0006).
 */
export async function demanderJson<T>(
  consigne: string,
  contenu: string,
  delaiMs: number,
): Promise<T | null> {
  const baseUrl = process.env.AI_BASE_URL;
  const modele = process.env.AI_MODEL;
  if (!baseUrl || !modele) return null;
  try {
    const reponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY ?? ''}`,
      },
      body: JSON.stringify({
        model: modele,
        messages: [
          { role: 'system', content: consigne },
          { role: 'user', content: contenu },
        ],
      }),
      signal: AbortSignal.timeout(delaiMs),
    });
    if (!reponse.ok) return null;
    const corps = (await reponse.json()) as {
      choices: { message: { content: string } }[];
    };
    const texte = corps.choices[0].message.content;
    const json = texte.match(/[[{][\s\S]*[\]}]/)?.[0];
    return json ? (JSON.parse(json) as T) : null;
  } catch {
    return null;
  }
}

export interface Analyse {
  recommandation: 'suivre' | 'attendre' | 'ignorer';
  explication: string;
  modele: string;
}

const RECOMMANDATIONS = ['suivre', 'attendre', 'ignorer'] as const;

/** Phrase de secours, construite à partir des 3 critères (jamais d'invention). */
function explicationDeSecours(trend: Trend): Analyse {
  const criteres = [
    { nom: "l'évolution sur 12 mois", v: trend.evolution },
    { nom: 'la récurrence', v: trend.recurrence },
    { nom: 'la diffusion géographique', v: trend.diffusion },
  ].sort((a, b) => b.v - a.v);
  const e = etat(trend.score);
  return {
    recommandation:
      e === 'durable' ? 'suivre' : e === 'surveiller' ? 'attendre' : 'ignorer',
    explication: `Score ${trend.score}/100 (${ETATS[e].toLowerCase()}) porté surtout par ${criteres[0].nom} (${criteres[0].v}/100) ; le point faible est ${criteres[2].nom} (${criteres[2].v}/100).`,
    modele: 'texte calculé',
  };
}

/**
 * Explication du score en une phrase. L'IA ne voit que les critères calculés
 * par Data et ne change jamais le score.
 */
export async function expliquerScore(trend: Trend): Promise<Analyse> {
  const brut = await demanderJson<Partial<Analyse>>(
    'Tu conseilles les équipes innovation de Givaudan (arômes, parfums, beauté). On te donne le score de durabilité d\'une tendance et ses 3 critères. Ne modifie aucun chiffre. Réponds UNIQUEMENT en JSON : {"recommandation": "suivre" | "attendre" | "ignorer", "explication": "<une ou deux phrases en français qui expliquent le score>"}.',
    JSON.stringify({
      tendance: trend.nom,
      metier: METIERS[trend.metier],
      score: trend.score,
      etat: ETATS[etat(trend.score)],
      criteres: {
        evolution_12_mois: trend.evolution,
        recurrence: trend.recurrence,
        diffusion_pays: trend.diffusion,
      },
      pays: trend.pays,
    }),
    20_000,
  );
  const recommandation = RECOMMANDATIONS.find(
    (r) => r === brut?.recommandation,
  );
  if (recommandation && typeof brut?.explication === 'string') {
    return {
      recommandation,
      explication: brut.explication,
      modele: process.env.AI_MODEL ?? 'inconnu',
    };
  }
  return explicationDeSecours(trend);
}

export async function enregistrerAnalyse(
  trendId: string,
  analyse: Analyse,
): Promise<void> {
  await pool.query(
    'INSERT INTO analyses (trend_id, recommandation, explication, modele) VALUES ($1, $2, $3, $4)',
    [trendId, analyse.recommandation, analyse.explication, analyse.modele],
  );
}

/** Note d'une page « Proposer la piste » : brouillon modifiable par Camille. */
export function notePiste(trend: Trend, p: Proposition) {
  const e = ETATS[etat(trend.score)];
  const arome = p.auCatalogue
    ? `${p.auCatalogue.nom} (${p.auCatalogue.ref}), déjà au catalogue : mise sur le marché en environ ${p.delaiMois} mois.`
    : `Aucun arôme au catalogue : création à lancer, environ ${p.delaiMois} mois.`;
  const alternatives = p.alternatives
    .map((a) => `- ${a.arome.nom} (${a.arome.ref}), proximité ${a.proximite} %`)
    .join('\n');
  const risques = [p.auCatalogue, ...p.alternatives.map((a) => a.arome)]
    .filter((a) => a !== null)
    .slice(0, 2)
    .map(
      (a) =>
        `- ${a.nom} : matière ${a.disponibilite}, coût ${a.cout === 'stable' ? 'stable' : `en ${a.cout}`}. ${a.risque}`,
    )
    .join('\n');

  return `Piste : ${trend.nom} (${METIERS[trend.metier]})

Pourquoi maintenant
${trend.nom} obtient ${trend.score}/100 au score de durabilité (${e.toLowerCase()}). Évolution ${trend.evolution}/100, récurrence ${trend.recurrence}/100, diffusion ${trend.diffusion}/100. En hausse : ${trend.pays.map(nomPays).join(', ')}.

Ce que Givaudan peut proposer
${arome}

Alternatives du catalogue
${alternatives || '- Aucune alternative proche.'}

Idées produits
${p.pistes.map((x) => `- ${METIERS[x.metier]} : ${x.idee}`).join('\n')}

Risques matière
${risques || '- Aucun risque identifié.'}

Données simulées pour le prototype.`;
}
