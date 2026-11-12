import { proposition } from '@/lib/catalogue';
import { getTrend } from '@/lib/trends';

export const dynamic = 'force-dynamic';

/** Ce que Givaudan peut proposer : arôme au catalogue, délai, alternatives. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trend = await getTrend(id);
  if (!trend) {
    return Response.json({ error: 'Tendance introuvable' }, { status: 404 });
  }
  return Response.json(await proposition(trend));
}
