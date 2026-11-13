/** Modèle d'une tendance et calculs purs (utilisables côté navigateur). */

export type Metier = 'taste' | 'fragrance' | 'beauty';
export type Etat = 'durable' | 'surveiller' | 'buzz';

export interface Trend {
  id: string;
  nom: string;
  metier: Metier;
  categories: string[];
  description: string;
  /** Pays où la tendance monte ; le premier est le pays d'origine */
  pays: string[];
  emoji: string;
  notes: string[];
  /** Score de durabilité sur 100, calculé par l'équipe Data */
  score: number;
  /** Score de la veille ; null pour une nouvelle tendance */
  score_veille: number | null;
  evolution: number;
  recurrence: number;
  diffusion: number;
  /** Intérêt de recherche mensuel (0-100), 60 mois de déc. 2021 à nov. 2026 */
  courbe: number[];
  arome_ref: string | null;
  simule: boolean;
}

export const METIERS: Record<Metier, string> = {
  taste: 'Taste',
  fragrance: 'Fragrance',
  beauty: 'Beauty',
};

export const ETATS: Record<Etat, string> = {
  durable: 'Durable',
  surveiller: 'À surveiller',
  buzz: 'Buzz',
};

/**
 * Seuils de l'équipe Data (validate_score.py, 79 % de bons classements sur
 * 28 cas) : ≥ 35 durable. Zone « à surveiller » 25-34 : choix Tech à confirmer.
 */
export function etat(score: number): Etat {
  return score >= 35 ? 'durable' : score >= 25 ? 'surveiller' : 'buzz';
}

/** Variation depuis la veille ; null pour une nouvelle tendance. */
export function variation(trend: Trend): number | null {
  return trend.score_veille === null ? null : trend.score - trend.score_veille;
}

/** Libellé du mois i de la courbe (0 = décembre 2021). */
export function moisCourbe(i: number) {
  const date = new Date(2021, 11 + i, 1);
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

/** Variation de l'intérêt sur 12 mois, en %. */
export function variation12Mois(trend: Trend) {
  const c = trend.courbe;
  const avant = Math.max(c[c.length - 13], 1);
  return Math.round(((c[c.length - 1] - avant) / avant) * 100);
}

/**
 * Résumé du fil du jour en 3 phrases, calculé à partir des variations
 * (déterministe : pas d'appel à l'IA, donc instantané et toujours juste).
 */
export function resumeDuJour(trends: Trend[]) {
  const avecVariation = trends.filter((t) => t.score_veille !== null);
  const hausse = [...avecVariation].sort(
    (a, b) => (variation(b) ?? 0) - (variation(a) ?? 0),
  )[0];
  const baisse = [...avecVariation].sort(
    (a, b) => (variation(a) ?? 0) - (variation(b) ?? 0),
  )[0];
  const nouvelles = trends.filter((t) => t.score_veille === null);

  const phrases: string[] = [];
  if (hausse && (variation(hausse) ?? 0) > 0) {
    phrases.push(
      `${hausse.nom} gagne ${variation(hausse)} points et passe à ${hausse.score}/100 : ${ETATS[etat(hausse.score)].toLowerCase()}.`,
    );
  }
  if (baisse && (variation(baisse) ?? 0) < 0) {
    phrases.push(
      `${baisse.nom} perd ${-(variation(baisse) ?? 0)} points : la tendance retombe.`,
    );
  }
  if (nouvelles.length) {
    phrases.push(
      `${nouvelles.length === 1 ? 'Nouvelle tendance' : 'Nouvelles tendances'} à regarder : ${nouvelles.map((t) => t.nom).join(', ')}.`,
    );
  }
  return phrases;
}
