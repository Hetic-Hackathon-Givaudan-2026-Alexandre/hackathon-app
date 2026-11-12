/** État de chargement pendant que la recherche (et l'IA) travaillent. */
export default function Chargement() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p role="status" className="flex items-center gap-3 text-lg text-brume">
        <span className="h-3 w-3 animate-pulse rounded-full bg-lueur shadow-[0_0_12px_var(--color-lueur)]" />
        Recherche des tendances qui correspondent…
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="verre h-40 animate-pulse" />
        ))}
      </div>
    </main>
  );
}
