/** Pays cités par les tendances : nom, position sur le globe et région. */
export const PAYS: Record<
  string,
  { nom: string; lat: number; lng: number; region: string }
> = {
  JP: { nom: 'Japon', lat: 36.2, lng: 138.3, region: 'asie' },
  KR: { nom: 'Corée du Sud', lat: 36.5, lng: 127.9, region: 'asie' },
  PH: { nom: 'Philippines', lat: 12.9, lng: 121.8, region: 'asie' },
  NP: { nom: 'Népal', lat: 28.4, lng: 84.1, region: 'asie' },
  AE: {
    nom: 'Émirats arabes unis',
    lat: 24.5,
    lng: 54.4,
    region: 'moyen-orient',
  },
  FR: { nom: 'France', lat: 46.6, lng: 2.4, region: 'europe' },
  GB: { nom: 'Royaume-Uni', lat: 54.0, lng: -2.0, region: 'europe' },
  DE: { nom: 'Allemagne', lat: 51.2, lng: 10.4, region: 'europe' },
  IT: { nom: 'Italie', lat: 42.8, lng: 12.6, region: 'europe' },
  US: { nom: 'États-Unis', lat: 39.8, lng: -98.6, region: 'amerique' },
  MX: { nom: 'Mexique', lat: 23.6, lng: -102.6, region: 'amerique' },
  AU: { nom: 'Australie', lat: -25.3, lng: 133.8, region: 'oceanie' },
};

export function nomPays(code: string) {
  return PAYS[code]?.nom ?? code;
}

/** Mots qu'un client peut taper pour désigner une région ou un pays. */
export const MOTS_REGIONS: Record<string, string[]> = {
  asie: ['JP', 'KR', 'PH', 'NP'],
  asiatique: ['JP', 'KR', 'PH', 'NP'],
  europe: ['FR', 'GB', 'DE', 'IT'],
  europeen: ['FR', 'GB', 'DE', 'IT'],
  amerique: ['US', 'MX'],
  usa: ['US'],
  'etats-unis': ['US'],
  japon: ['JP'],
  coree: ['KR'],
  france: ['FR'],
  allemagne: ['DE'],
  italie: ['IT'],
  mexique: ['MX'],
  'moyen-orient': ['AE'],
  dubai: ['AE'],
};
