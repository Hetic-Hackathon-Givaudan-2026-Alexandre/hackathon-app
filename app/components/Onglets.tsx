'use client';

import { useState } from 'react';

/** Onglets « Décision » (ouvert par défaut) et « Signaux » de la fiche tendance. */
export default function Onglets({
  decision,
  signaux,
}: {
  decision: React.ReactNode;
  signaux: React.ReactNode;
}) {
  const [actif, setActif] = useState<'decision' | 'signaux'>('decision');
  const onglets = [
    { id: 'decision', libelle: 'Décision' },
    { id: 'signaux', libelle: 'Signaux' },
  ] as const;
  return (
    <div>
      <div
        role="tablist"
        aria-label="Vues de la tendance"
        className="inline-flex rounded-full border border-bord bg-white/[0.04] p-1"
      >
        {onglets.map((o) => (
          <button
            key={o.id}
            id={`onglet-${o.id}`}
            role="tab"
            type="button"
            aria-selected={actif === o.id}
            aria-controls={`panneau-${o.id}`}
            onClick={() => setActif(o.id)}
            className={`rounded-full px-5 py-2 text-sm transition-colors ${
              actif === o.id
                ? 'bg-white text-espace'
                : 'text-brume hover:text-texte'
            }`}
          >
            {o.libelle}
          </button>
        ))}
      </div>
      <div
        id="panneau-decision"
        role="tabpanel"
        aria-labelledby="onglet-decision"
        hidden={actif !== 'decision'}
        className="mt-5"
      >
        {decision}
      </div>
      <div
        id="panneau-signaux"
        role="tabpanel"
        aria-labelledby="onglet-signaux"
        hidden={actif !== 'signaux'}
        className="mt-5"
      >
        {signaux}
      </div>
    </div>
  );
}
