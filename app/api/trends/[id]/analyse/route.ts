import { analyserTendance, enregistrerAnalyse } from '@/lib/ia';
import { getTrend, scoreTrend } from '@/lib/trends';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trend = await getTrend(id);
  if (!trend) {
    return Response.json({ error: 'Tendance introuvable' }, { status: 404 });
  }

  try {
    const analyse = await analyserTendance(trend, scoreTrend(trend));
    await enregistrerAnalyse(trend.id, analyse);
    return Response.json(analyse);
  } catch (erreur) {
    console.error(erreur);
    return Response.json(
      { error: "Fournisseur d'IA indisponible" },
      { status: 503 },
    );
  }
}
