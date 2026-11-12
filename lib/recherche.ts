import { demanderJson } from '@/lib/ia';
import { MOTS_REGIONS, nomPays } from '@/lib/pays';
import { ETATS, etat, type Trend } from '@/lib/trends';

export interface Resultat {
  trend: Trend;
  raison: string;
}

/** Minuscules, sans accents, pour comparer « agrumes » et « Agrume ». */
function normaliser(texte: string) {
  return texte.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Mots du client → mots du modèle de données. */
const SYNONYMES: Record<string, string[]> = {
  boisson: ['boissons'],
  soda: ['boissons'],
  biere: ['boissons'],
  cocktail: ['boissons', 'gastronomie'],
  dessert: ['desserts', 'patisserie'],
  gateau: ['patisserie'],
  agrume: ['agrume', 'agrumes'],
  citron: ['agrume', 'agrumes'],
  parfum: ['parfum', 'fragrance'],
  cosmetique: ['soin', 'beauty'],
  creme: ['soin', 'beauty'],
  sucre: ['sucre', 'gourmand'],
  epice: ['epice', 'epices', 'pimente'],
  piment: ['pimente', 'epice'],
  the: ['the'],
  sante: ['sante', 'bien-etre'],
  frais: ['frais', 'propre'],
};

/** Mots vides ignorés dans la demande du client. */
const MOTS_VIDES = new Set([
  'pour',
  'aux',
  'des',
  'les',
  'une',
  'avec',
  'dans',
  'sur',
  'qui',
  'que',
  'mon',
  'notre',
  'client',
  'cherche',
  'veut',
  'nouveau',
  'nouvelle',
]);

function racine(mot: string) {
  return mot.replace(/(es|s|x)$/, '');
}

/**
 * Classement par mots-clés : rapide, déterministe, et ne renvoie que des
 * tendances existantes. Sert de résultat par défaut et de repli si l'IA échoue.
 */
export function rechercheMotsCles(q: string, trends: Trend[]): Resultat[] {
  const mots = normaliser(q)
    .split(/[^a-z0-9-]+/)
    .filter((m) => m.length > 2 && !MOTS_VIDES.has(m));
  const paysCibles = new Set(mots.flatMap((m) => MOTS_REGIONS[m] ?? []));
  const termes = mots.flatMap((m) => [
    racine(m),
    ...(SYNONYMES[racine(m)] ?? []).map(racine),
  ]);

  return trends
    .map((trend) => {
      const champs = {
        nom: normaliser(trend.nom)
          .split(/[^a-z0-9-]+/)
          .map(racine),
        categories: trend.categories.map((c) => racine(normaliser(c))),
        notes: trend.notes.map((n) => racine(normaliser(n))),
        description: normaliser(trend.description),
        metier: trend.metier,
      };
      const trouves = new Set<string>();
      let points = 0;
      for (const t of termes) {
        if (champs.nom.includes(t)) {
          points += 5;
          trouves.add(trend.nom);
        }
        const iCat = champs.categories.indexOf(t);
        const iNote = champs.notes.indexOf(t);
        if (iCat >= 0 || iNote >= 0) {
          points += 3;
          // On affiche le mot d'origine (« agrumes »), pas sa racine
          trouves.add(iCat >= 0 ? trend.categories[iCat] : trend.notes[iNote]);
        }
        if (champs.metier === t) points += 2;
        if (t.length > 3 && champs.description.includes(t)) points += 1;
      }
      const paysCommuns = trend.pays.filter((p) => paysCibles.has(p));
      points += paysCommuns.length * 2;
      if (paysCibles.size && !paysCommuns.length) points -= 2;

      // Ex. « Boissons, agrumes, en hausse : Japon, Corée du Sud. Durable (82/100). »
      const morceaux: string[] = [];
      if (trouves.size) {
        const liste = [...trouves].slice(0, 3).join(', ');
        morceaux.push(liste.charAt(0).toUpperCase() + liste.slice(1));
      }
      if (paysCommuns.length) {
        morceaux.push(`en hausse : ${paysCommuns.map(nomPays).join(', ')}`);
      }
      const debut = morceaux.join(', ');
      const phrase = debut
        ? `${debut.charAt(0).toUpperCase()}${debut.slice(1)}. `
        : '';

      return {
        trend,
        points: points + trend.score / 100,
        raison: `${phrase}${ETATS[etat(trend.score)]} (${trend.score}/100).`,
      };
    })
    .filter((r) => r.points >= 3)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .map(({ trend, raison }) => ({ trend, raison }));
}

/**
 * Recherche « langage courant » : l'IA reclasse les tendances et justifie.
 * Sa réponse JSON est vérifiée : seuls les identifiants existants sont gardés.
 * Délai maximal 4 s (critère < 5 s), sinon on garde le classement par mots-clés.
 */
export async function rechercher(
  q: string,
  trends: Trend[],
): Promise<{ resultats: Resultat[]; source: 'ia' | 'mots-cles' }> {
  const parMotsCles = rechercheMotsCles(q, trends);

  const reponse = await demanderJson<{ id: string; raison: string }[]>(
    'Tu aides une cheffe de produit Givaudan à répondre à un client. On te donne la demande du client et la liste des tendances disponibles. Réponds UNIQUEMENT par un tableau JSON de 0 à 5 objets {"id": "...", "raison": "une phrase courte en français"}, du plus pertinent au moins pertinent. N\'utilise que des id de la liste. Si rien ne correspond, réponds [].',
    JSON.stringify({
      demande: q,
      tendances: trends.map((t) => ({
        id: t.id,
        nom: t.nom,
        metier: t.metier,
        categories: t.categories,
        notes: t.notes,
        pays: t.pays,
      })),
    }),
    4000,
  );

  const parId = new Map(trends.map((t) => [t.id, t]));
  const valides = Array.isArray(reponse)
    ? reponse
        .filter((r) => parId.has(r?.id) && typeof r.raison === 'string')
        .slice(0, 5)
        .map((r) => ({ trend: parId.get(r.id)!, raison: r.raison }))
    : [];

  return valides.length
    ? { resultats: valides, source: 'ia' }
    : { resultats: parMotsCles, source: 'mots-cles' };
}
