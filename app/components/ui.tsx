/** Petits éléments d'interface partagés (sans état). */
import { ETATS, type Etat, METIERS, type Metier } from '@/lib/modele';

const STYLE_ETAT: Record<Etat, string> = {
  durable: 'bg-lueur/15 text-lueur ring-lueur/30',
  surveiller: 'bg-ambre/15 text-ambre ring-ambre/30',
  buzz: 'bg-alerte/15 text-alerte ring-alerte/30',
};

export function BadgeEtat({ etat }: { etat: Etat }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STYLE_ETAT[etat]}`}
    >
      {ETATS[etat]}
    </span>
  );
}

/** Variation depuis la veille : « +6 », « −10 » ou « Nouvelle ». */
export function Variation({ valeur }: { valeur: number | null }) {
  if (valeur === null) {
    return (
      <span className="rounded-full bg-givaudan/20 px-2.5 py-0.5 text-xs font-semibold text-givaudan">
        Nouvelle
      </span>
    );
  }
  const couleur =
    valeur > 0 ? 'text-lueur' : valeur < 0 ? 'text-alerte' : 'text-brume';
  const signe = valeur > 0 ? '↑ +' : valeur < 0 ? '↓ −' : '';
  return (
    <span className={`text-sm font-semibold tabular-nums ${couleur}`}>
      {valeur === 0 ? 'stable' : `${signe}${Math.abs(valeur)}`}
    </span>
  );
}

export function Pastille({
  emoji,
  taille = 'md',
}: {
  emoji: string;
  taille?: 'md' | 'lg';
}) {
  const t = taille === 'lg' ? 'h-20 w-20 text-5xl' : 'h-12 w-12 text-2xl';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/[0.03] ring-1 ring-bord ${t}`}
    >
      {emoji}
    </span>
  );
}

export function NomMetier({ metier }: { metier: Metier }) {
  return <>{METIERS[metier]}</>;
}

/** Anneau du score de durabilité (comme sur les maquettes). */
export function AnneauScore({ score, etat }: { score: number; etat: Etat }) {
  const rayon = 52;
  const tour = 2 * Math.PI * rayon;
  const couleur =
    etat === 'durable'
      ? 'var(--color-lueur)'
      : etat === 'surveiller'
        ? 'var(--color-ambre)'
        : 'var(--color-alerte)';
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={rayon}
          fill="none"
          stroke="rgb(255 255 255 / 0.08)"
          strokeWidth="9"
        />
        <circle
          cx="60"
          cy="60"
          r={rayon}
          fill="none"
          stroke={couleur}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * tour} ${tour}`}
          style={{ filter: `drop-shadow(0 0 6px ${couleur})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums">{score}</span>
        <span className="text-xs text-brume">/100</span>
      </div>
    </div>
  );
}
