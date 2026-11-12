import ListeSuivies from '@/app/components/ListeSuivies';
import { getTrends } from '@/lib/trends';

export const dynamic = 'force-dynamic';

export default async function Suivies() {
  const trends = await getTrends();
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-normal">Favoris</h1>
      <p className="mt-2 text-brume">
        Les tendances que vous suivez, et leur évolution depuis hier.
      </p>
      <div className="mt-8">
        <ListeSuivies trends={trends} />
      </div>
    </main>
  );
}
