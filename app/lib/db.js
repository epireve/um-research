/**
 * Database connection module for PostgreSQL with pgvector
 * 
 * This module provides a database connection pool for PostgreSQL
 * with pgvector support for vector operations.
 */

import pg from 'pg';
const { Pool } = pg;

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Configuration for the PostgreSQL connection
const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a connection pool
const pool = new Pool(config);

// Add event listeners for connection issues
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
    
    // Check if pgvector extension is installed
    pool.query('SELECT * FROM pg_extension WHERE extname = $1', ['vector'])
      .then(res => {
        if (res.rowCount === 0) {
          console.warn('Warning: pgvector extension is not installed in the database');
        } else {
          console.log('pgvector extension is installed');
        }
      })
      .catch(err => {
        console.error('Error checking pgvector extension:', err);
      });
  }
});

/**
 * Execute a query with proper error handling
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} - Query result
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

/**
 * Get a client from the pool with transaction support
 * @returns {Object} - Database client
 */
export async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Override client.query to log queries
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };
  
  // Override client.release to track release time
  client.release = () => {
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
}

// Export the pool for direct use
export { pool };

export default {
  pool,
  query,
  getClient
};