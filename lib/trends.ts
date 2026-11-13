import { pool } from '@/lib/db';
import type { Trend } from '@/lib/modele';

export * from '@/lib/modele';

const COLONNES = `id, nom, metier, categories, description, pays, emoji, notes,
  score, score_veille, evolution, recurrence, diffusion, courbe, arome_ref, simule`;

export async function getTrends(): Promise<Trend[]> {
  const { rows } = await pool.query<Trend>(
    `SELECT ${COLONNES} FROM trends ORDER BY score DESC`,
  );
  return rows;
}

export interface Analyse {
  recommandation: string;
  explication: string;
  modele: string;
}

/** Dernière explication enregistrée (celles de l'équipe Data ou de l'IA). */
export async function getDerniereAnalyse(id: string): Promise<Analyse | null> {
  const { rows } = await pool.query<Analyse>(
    `SELECT recommandation, explication, modele FROM analyses
     WHERE trend_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function getTrend(id: string): Promise<Trend | undefined> {
  const { rows } = await pool.query<Trend>(
    `SELECT ${COLONNES} FROM trends WHERE id = $1`,
    [id],
  );
  return rows[0];
}
