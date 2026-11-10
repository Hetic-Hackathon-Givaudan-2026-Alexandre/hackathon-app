import { getTrends, scoreTrend } from '@/lib/trends';

export function GET() {
  const items = getTrends().map((trend) => ({
    ...trend,
    score: scoreTrend(trend),
  }));
  return Response.json(items);
}
