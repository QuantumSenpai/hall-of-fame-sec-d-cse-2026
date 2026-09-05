import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

let dbInstance: any = null;

/**
 * Returns the singleton Drizzle instance connected to Neon PostgreSQL over HTTP.
 * HTTP driver eliminates WebSocket handshake latency and avoids connection pooling limits in serverless.
 */
export function getDb() {
  if (dbInstance) return dbInstance;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === '') {
    throw new Error('CRITICAL CONFIG ERROR: DATABASE_URL environment variable is missing.');
  }

  const sql = neon(connectionString);
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
}

export { schema };
