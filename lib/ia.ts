import { pool } from '@/lib/db';
import type { Score, Trend } from '@/lib/trends';

export interface Analyse {
  recommandation: 'suivre' | 'attendre' | 'ignorer';
  explication: string;
  modele: string;
}

const RECOMMANDATIONS = ['suivre', 'attendre', 'ignorer'] as const;

/**
 * Demande à l'IA (API compatible OpenAI) si Givaudan doit suivre la tendance.
 * Seuls des indicateurs agrégés sont envoyés : aucune donnée personnelle.
 */
export async function analyserTendance(
  trend: Trend,
  score: Score,
): Promise<Analyse> {
  const baseUrl = process.env.AI_BASE_URL;
  const modele = process.env.AI_MODEL;
  if (!baseUrl || !modele) {
    throw new Error('AI_BASE_URL et AI_MODEL doivent être définis');
  }

  const consigne =
    'Tu conseilles les équipes innovation de Givaudan (arômes et parfums). ' +
    'Réponds uniquement en JSON : {"recommandation": "suivre" | "attendre" | "ignorer", ' +
    '"explication": "<3 phrases en français>"}.';

  const donnees = {
    nom: trend.nom,
    categorie: trend.categorie,
    mentions_par_periode: trend.mentions,
    nombre_de_sources: trend.sources.length,
    sources: trend.sources,
    nombre_de_pays: trend.pays.length,
    score,
  };

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
        {
          role: 'user',
          content: `Buzz ou tendance durable ? ${JSON.stringify(donnees)}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!reponse.ok) {
    throw new Error(`Fournisseur d'IA : HTTP ${reponse.status}`);
  }

  const corps = (await reponse.json()) as {
    choices: { message: { content: string } }[];
  };
  return lireReponse(corps.choices[0].message.content, modele);
}

/** Extrait le JSON de la réponse ; repli lisible si le modèle sort du format. */
function lireReponse(texte: string, modele: string): Analyse {
  const json = texte.match(/\{[\s\S]*\}/)?.[0];
  try {
    const brut = JSON.parse(json ?? '') as Partial<Analyse>;
    const recommandation = RECOMMANDATIONS.find(
      (r) => r === brut.recommandation,
    );
    if (recommandation && brut.explication) {
      return { recommandation, explication: brut.explication, modele };
    }
  } catch {
    // Réponse non JSON : on garde le texte brut ci-dessous
  }
  return { recommandation: 'attendre', explication: texte.trim(), modele };
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
