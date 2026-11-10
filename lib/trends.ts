import { pool } from '@/lib/db';

export type Categorie = 'food' | 'fragrance' | 'beauty';

export interface Trend {
  id: string;
  nom: string;
  categorie: Categorie;
  description: string;
  pays: string[];
  sources: string[];
  /** Volume de mentions par période, de la plus ancienne à la plus récente */
  mentions: number[];
  /** true tant que la donnée est simulée (à annoncer pendant la démo) */
  simule: boolean;
}

export interface Score {
  total: number;
  croissance: number;
  convergence: number;
  diffusion: number;
  verdict: 'tendance durable' | 'à surveiller' | 'buzz';
}

const COLONNES =
  'id, nom, categorie, description, pays, sources, mentions, simule';

export async function getTrends(): Promise<Trend[]> {
  const { rows } = await pool.query<Trend>(
    `SELECT ${COLONNES} FROM trends ORDER BY nom`,
  );
  return rows;
}

export async function getTrend(id: string): Promise<Trend | undefined> {
  const { rows } = await pool.query<Trend>(
    `SELECT ${COLONNES} FROM trends WHERE id = $1`,
    [id],
  );
  return rows[0];
}

/**
 * Score sur 100 qui distingue un buzz d'une tendance durable.
 * - croissance (40 pts) : la dernière période reste proche du pic
 * - convergence (30 pts) : la tendance apparaît sur plusieurs types de sources
 * - diffusion (30 pts) : la tendance touche plusieurs pays
 */
export function scoreTrend(trend: Trend): Score {
  const m = trend.mentions;
  const recent = m[m.length - 1];
  const pic = Math.max(...m);

  const croissance = Math.round((recent / pic) * 40);
  const convergence = Math.min(trend.sources.length, 5) * 6;
  const diffusion = Math.min(trend.pays.length, 5) * 6;

  const total = croissance + convergence + diffusion;
  const verdict =
    total >= 70 ? 'tendance durable' : total >= 45 ? 'à surveiller' : 'buzz';

  return { total, croissance, convergence, diffusion, verdict };
}
