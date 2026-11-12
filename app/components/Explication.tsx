'use client';

import { useEffect, useState } from 'react';

interface Analyse {
  recommandation: string;
  explication: string;
  modele: string;
}

/**
 * Phrase qui explique le score, demandée à l'IA à l'ouverture de la fiche
 * (POST /api/trends/{id}/analyse). L'IA ne change jamais le score.
 */
export default function Explication({ trendId }: { trendId: string }) {
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    let annule = false;
    fetch(`/api/trends/${trendId}/analyse`, { method: 'POST' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((a: Analyse) => !annule && setAnalyse(a))
      .catch(() => !annule && setErreur(true));
    return () => {
      annule = true;
    };
  }, [trendId]);

  if (erreur) {
    return (
      <p role="alert" className="text-sm text-alerte">
        L&apos;explication n&apos;a pas pu être générée. Rechargez la page pour
        réessayer.
      </p>
    );
  }
  if (!analyse) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-brume">
        <span className="h-2 w-2 animate-pulse rounded-full bg-lueur" />
        L&apos;IA rédige l&apos;explication du score…
      </p>
    );
  }
  const parIa = analyse.modele !== 'texte calculé';
  return (
    <div aria-live="polite">
      <p className="text-texte/90">{analyse.explication}</p>
      <p className="mt-1 text-xs text-brume">
        {parIa
          ? `✦ Rédigé par l'IA (${analyse.modele}) à partir des 3 critères`
          : 'Texte calculé à partir des 3 critères (IA indisponible)'}
        , recommandation : <strong>{analyse.recommandation}</strong>
      </p>
    </div>
  );
}
