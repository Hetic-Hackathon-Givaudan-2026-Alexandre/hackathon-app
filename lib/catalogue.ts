import { pool } from '@/lib/db';
import type { Metier, Trend } from '@/lib/modele';

export interface Arome {
  ref: string;
  nom: string;
  metier: Metier;
  notes: string[];
  description: string;
  disponibilite: 'disponible' | 'tendue' | 'rare';
  cout: 'stable' | 'hausse' | 'baisse';
  recolte: string;
  risque: string;
}

export interface Alternative {
  arome: Arome;
  /** Proximité avec la tendance, en % */
  proximite: number;
  notesCommunes: string[];
}

export interface Proposition {
  /** Arôme qui existe déjà au catalogue, ou null s'il est à créer */
  auCatalogue: Arome | null;
  /** Délai de mise sur le marché (expert Givaudan : 1 mois si au catalogue, 6 sinon) */
  delaiMois: number;
  alternatives: Alternative[];
  pistes: { metier: Metier; idee: string }[];
}

export async function getAromes(): Promise<Arome[]> {
  const { rows } = await pool.query<Arome>(
    `SELECT ref, nom, metier, notes, description, disponibilite, cout, recolte, risque
     FROM aromes ORDER BY ref`,
  );
  return rows;
}

/**
 * Proximité entre deux listes de notes (indice de Jaccard), avec un bonus
 * si l'arôme est du même métier. Déterministe : seuls des arômes du
 * catalogue peuvent sortir, jamais un arôme inventé.
 */
function proximite(trend: Trend, arome: Arome) {
  const a = new Set(trend.notes);
  const communes = arome.notes.filter((n) => a.has(n));
  const union = new Set([...trend.notes, ...arome.notes]).size;
  const bonus = arome.metier === trend.metier ? 0.1 : 0;
  const valeur = Math.min(0.99, communes.length / union + bonus);
  return { valeur, communes };
}

/** Pistes produits, une par métier (exemples du document Product). */
function pistes(trend: Trend): Proposition['pistes'] {
  const nom = trend.nom.split(' :')[0].toLowerCase();
  return [
    { metier: 'taste', idee: `Boisson pétillante au ${nom}` },
    { metier: 'fragrance', idee: `Eau de Cologne aux notes de ${nom}` },
    { metier: 'beauty', idee: `Crème mains parfumée au ${nom}` },
  ];
}

export async function proposition(trend: Trend): Promise<Proposition> {
  const aromes = await getAromes();
  const auCatalogue = aromes.find((a) => a.ref === trend.arome_ref) ?? null;

  const alternatives = aromes
    .filter((a) => a.ref !== trend.arome_ref)
    .map((arome) => {
      const { valeur, communes } = proximite(trend, arome);
      return {
        arome,
        proximite: Math.round(valeur * 100),
        notesCommunes: communes,
      };
    })
    .filter((a) => a.notesCommunes.length > 0)
    .sort((a, b) => b.proximite - a.proximite)
    .slice(0, 3);

  return {
    auCatalogue,
    delaiMois: auCatalogue ? 1 : 6,
    alternatives,
    pistes: pistes(trend),
  };
}
