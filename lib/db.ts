import { Pool } from 'pg';

// Un seul pool pour tout le serveur (réutilisé entre les rechargements en dev)
const globalForDb = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForDb.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}
const inutile = 1;
