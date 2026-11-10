import { getTrends, scoreTrend } from '@/lib/trends';

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = (await getTrends()).map((trend) => ({
    ...trend,
    score: scoreTrend(trend),
  }));
  return Response.json(items);
}
