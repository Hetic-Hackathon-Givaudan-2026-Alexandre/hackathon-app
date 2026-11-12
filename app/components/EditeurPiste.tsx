'use client';

import { useState } from 'react';

const OUTILS = ['Pegasus', 'Salesforce', 'Atlas'] as const;

/** Note modifiable, bouton Copier, et envoi simulé vers un outil Givaudan. */
export default function EditeurPiste({
  noteInitiale,
}: {
  noteInitiale: string;
}) {
  const [note, setNote] = useState(noteInitiale);
  const [outil, setOutil] = useState<(typeof OUTILS)[number]>('Salesforce');
  const [message, setMessage] = useState<string | null>(null);

  async function copier() {
    try {
      await navigator.clipboard.writeText(note);
      setMessage('Note copiée dans le presse-papiers.');
    } catch {
      setMessage(
        'Copie impossible : sélectionnez le texte et faites Ctrl + C.',
      );
    }
  }

  return (
    <div className="verre p-5">
      <label htmlFor="note" className="sr-only">
        Note de la piste
      </label>
      <textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={24}
        className="w-full resize-y rounded-2xl border border-bord bg-espace/60 p-5 leading-relaxed focus:border-lueur/60 focus:outline-none"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copier}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-espace hover:bg-white/90"
        >
          Copier
        </button>
        <label htmlFor="outil" className="ml-auto text-sm text-brume">
          Envoyer vers
        </label>
        <select
          id="outil"
          value={outil}
          onChange={(e) => setOutil(e.target.value as (typeof OUTILS)[number])}
          className="rounded-full border border-bord bg-nuit px-4 py-2.5 text-sm"
        >
          {OUTILS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() =>
            setMessage(
              `Piste envoyée vers ${outil}. (Simulation : rien n'a réellement été envoyé.)`,
            )
          }
          className="rounded-full bg-givaudan px-5 py-2.5 text-sm font-medium text-white hover:bg-givaudan/90"
        >
          Envoyer
        </button>
      </div>
      {message && (
        <p role="status" className="mt-3 text-sm text-lueur">
          {message}
        </p>
      )}
    </div>
  );
}
