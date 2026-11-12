import { etat, getTrends, variation } from '@/lib/trends';

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = (await getTrends()).map((trend) => ({
    ...trend,
    etat: etat(trend.score),
    variation: variation(trend),
  }));
  return Response.json(items);
}
