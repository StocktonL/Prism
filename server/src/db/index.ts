import { Pool } from 'pg'

/**
 * PostgreSQL connection pool.
 * Set DATABASE_URL in your .env file, e.g.:
 *   DATABASE_URL=postgresql://user:password@localhost:5432/prism
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // In production, enable SSL:
  // ssl: { rejectUnauthorized: false },
})

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error:', err)
})

/**
 * Execute a parameterised query against the pool.
 *
 * @example
 * const { rows } = await query('SELECT * FROM patients WHERE id = $1', [id])
 */
export async function query<T extends Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[]; rowCount: number | null }> {
  const result = await pool.query<T>(text, params)
  return { rows: result.rows, rowCount: result.rowCount }
}

export default pool
