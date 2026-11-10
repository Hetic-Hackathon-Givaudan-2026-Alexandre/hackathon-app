import trendsData from '@/data/trends.json';

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

const trends = trendsData as Trend[];

export function getTrends(): Trend[] {
  return trends;
}

export function getTrend(id: string): Trend | undefined {
  return trends.find((t) => t.id === id);
}

/**
 * Score sur 100 qui distingue un buzz d'une tendance durable.
 * Critères documentés dans docs/adr (croissance, convergence, diffusion).
 */
export function scoreTrend(trend: Trend): Score {
  const m = trend.mentions;
  const recent = m[m.length - 1];
  const pic = Math.max(...m);

  // Croissance soutenue : la dernière période reste proche du pic
  const croissance = Math.round((recent / pic) * 40);
  // Convergence : une vraie tendance apparaît sur plusieurs types de sources
  const convergence = Math.min(trend.sources.length, 5) * 6;
  // Diffusion géographique
  const diffusion = Math.min(trend.pays.length, 5) * 6;

  const total = croissance + convergence + diffusion;
  const verdict =
    total >= 70 ? 'tendance durable' : total >= 45 ? 'à surveiller' : 'buzz';

  return { total, croissance, convergence, diffusion, verdict };
}
