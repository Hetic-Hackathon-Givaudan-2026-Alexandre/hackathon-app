'use client';

import { useSuivies } from '@/lib/suivi';

/** « Ajouter aux favoris » / « Favori » : un clic suit, un second clic annule. */
export default function BoutonSuivre({ id }: { id: string }) {
  const { ids, basculer } = useSuivies();
  const suivie = ids.includes(id);
  return (
    <button
      type="button"
      onClick={() => basculer(id)}
      aria-pressed={suivie}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
        suivie
          ? 'bg-ambre/15 text-ambre ring-1 ring-ambre/40'
          : 'bg-white text-espace hover:bg-white/90'
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={suivie ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
      {suivie ? 'Favori' : 'Ajouter aux favoris'}
    </button>
  );
}
