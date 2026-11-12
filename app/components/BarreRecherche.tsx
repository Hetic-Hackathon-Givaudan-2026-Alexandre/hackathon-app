/** Recherche pour un client, en langage courant (redirige vers /recherche?q=…). */
export default function BarreRecherche({
  valeur = '',
  grande = false,
}: {
  valeur?: string;
  grande?: boolean;
}) {
  return (
    <form
      action="/recherche"
      role="search"
      className={`flex items-center gap-2 rounded-full border border-bord bg-white/[0.06] pl-4 focus-within:border-lueur/60 ${
        grande ? 'p-1.5 pl-5' : 'p-1'
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-brume"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <label htmlFor={grande ? 'q-grande' : 'q'} className="sr-only">
        Demande du client
      </label>
      <input
        id={grande ? 'q-grande' : 'q'}
        name="q"
        type="search"
        required
        defaultValue={valeur}
        placeholder="boisson aux agrumes pour l'Asie"
        className={`min-w-0 flex-1 bg-transparent placeholder:text-brume/70 focus:outline-none ${
          grande ? 'py-2 text-lg' : 'py-1 text-sm'
        }`}
      />
      <button
        type="submit"
        className={`rounded-full bg-givaudan font-medium text-white hover:bg-givaudan/90 ${
          grande ? 'px-6 py-3' : 'px-4 py-1.5 text-sm'
        }`}
      >
        Chercher
      </button>
    </form>
  );
}
