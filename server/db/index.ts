import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema.ts';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

let dbInstance: any = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  if (connectionString && !connectionString.includes('sample_password') && !connectionString.includes('localhost')) {
    try {
      const client = new Pool({ connectionString });
      dbInstance = drizzle(client, { schema });
      console.log('Connected to Neon PostgreSQL');
      return dbInstance;
    } catch (err) {
      console.warn('Neon connection failed, falling back to local memory store', err);
    }
  }
  return null;
}

export { schema };
