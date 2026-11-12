import { rechercher } from '@/lib/recherche';
import { getTrends } from '@/lib/trends';

export const dynamic = 'force-dynamic';

/** Recherche en langage courant pour un client (GET /api/recherche?q=...). */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (!q) {
    return Response.json({ error: 'Paramètre q manquant' }, { status: 400 });
  }
  const { resultats, source } = await rechercher(q, await getTrends());
  return Response.json({
    source,
    resultats: resultats.map((r) => ({ id: r.trend.id, raison: r.raison })),
  });
}
