'use client';

import { useState } from 'react';

interface Analyse {
  recommandation: string;
  explication: string;
  modele: string;
}

export default function BoutonAnalyse({ trendId }: { trendId: string }) {
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function analyser() {
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch(`/api/trends/${trendId}/analyse`, {
        method: 'POST',
      });
      const corps = await reponse.json();
      if (!reponse.ok) throw new Error(corps.error);
      setAnalyse(corps);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={analyser}
        disabled={enCours}
        className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {enCours ? 'Analyse en cours…' : "Analyser avec l'IA"}
      </button>
      {erreur && <p className="mt-2 text-sm text-rose-700">{erreur}</p>}
      {analyse && (
        <div className="mt-3 rounded-lg bg-stone-100 p-3 text-sm">
          <p className="font-semibold">
            Recommandation : {analyse.recommandation}
          </p>
          <p className="mt-1">{analyse.explication}</p>
          <p className="mt-1 text-xs text-stone-500">
            Modèle : {analyse.modele}
          </p>
        </div>
      )}
    </div>
  );
}
