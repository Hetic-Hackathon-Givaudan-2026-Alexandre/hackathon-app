import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditeurPiste from '@/app/components/EditeurPiste';
import { proposition } from '@/lib/catalogue';
import { notePiste } from '@/lib/ia';
import { getTrend } from '@/lib/trends';

export const dynamic = 'force-dynamic';

export default async function Piste({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trend = await getTrend(id);
  if (!trend) notFound();
  const note = notePiste(trend, await proposition(trend));

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href={`/tendance/${trend.id}`}
        className="text-sm text-brume hover:text-texte"
      >
        ← {trend.nom}
      </Link>
      <h1 className="mt-4 text-4xl font-normal">Proposer la piste</h1>
      <p className="mt-2 text-brume">
        Note d&apos;une page préremplie à partir du score, du catalogue et des
        risques matière. Modifiez-la directement avant de l&apos;envoyer.
      </p>
      <div className="mt-6">
        <EditeurPiste noteInitiale={note} />
      </div>
    </main>
  );
}
