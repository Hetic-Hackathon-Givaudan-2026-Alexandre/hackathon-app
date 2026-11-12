import { enregistrerAnalyse, expliquerScore } from '@/lib/ia';
import { getTrend } from '@/lib/trends';

export const dynamic = 'force-dynamic';

/** Phrase qui explique le score (IA, avec repli calculé si elle ne répond pas). */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trend = await getTrend(id);
  if (!trend) {
    return Response.json({ error: 'Tendance introuvable' }, { status: 404 });
  }
  const analyse = await expliquerScore(trend);
  await enregistrerAnalyse(trend.id, analyse);
  return Response.json(analyse);
}
