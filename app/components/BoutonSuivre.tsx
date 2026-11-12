'use client';

import { useSuivies } from '@/lib/suivi';

/** « Suivre » / « Suivie » : un clic suit, un second clic annule. */
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
          ? 'bg-lueur/15 text-lueur ring-1 ring-lueur/40'
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
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      {suivie ? 'Suivie' : 'Suivre'}
    </button>
  );
}
