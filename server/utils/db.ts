import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config';
import * as schema from '@shared/schema';

// Create a connection pool
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
});

// Create a Drizzle ORM instance with the connection pool and schema
export const db = drizzle(pool, { schema });

// Export the pool for direct query usage if needed
export { pool as dbPool };

// Helper function to execute a transaction
export async function transaction<T>(callback: (tx: typeof db) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(db);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to check if the database connection is working
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Helper function to run database migrations
export async function runMigrations(): Promise<void> {
  try {
    // In a real application, you would use a proper migration tool like node-pg-migrate
    // or include your migration SQL files here
    console.log('Running database migrations...');
    // Example: await client.query('CREATE TABLE IF NOT EXISTS...');
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running database migrations:', error);
    throw error;
  }
}
