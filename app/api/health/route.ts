import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await pool.query<{ version: string }>('SELECT version()');
    return Response.json({ status: 'ok', db: rows[0].version });
  } catch {
    return Response.json(
      { status: 'erreur', db: 'base injoignable' },
      { status: 503 },
    );
  }
}
