import mysql from 'mysql2/promise';

// Singleton pattern para conexão com TiDB
let connection: mysql.Connection | null = null;

function parseBoolean(env?: string, defaultValue = false) {
  if (env === undefined) return defaultValue;
  return env === 'true' || env === '1';
}

export async function getDBConnection() {
  if (connection) {
    return connection;
  }

  try {
    const sslOptions = {
      minVersion: process.env.TIDB_SSL_MIN_VERSION || 'TLSv1.2',
      rejectUnauthorized: parseBoolean(process.env.TIDB_SSL_REJECT_UNAUTHORIZED, false),
    } as any;

    connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      port: Number.parseInt(process.env.TIDB_PORT || '4000'),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      supportBigNumbers: true,
      bigNumberStrings: true,
      ssl: sslOptions,
    });

    console.log('[v0] TiDB connection established', { ssl: sslOptions });
    return connection;
  } catch (error) {
    console.error('[v0] TiDB connection error:', error);
    throw error;
  }
}

export async function closeDBConnection() {
  if (connection) {
    await connection.end();
    connection = null;
    console.log('[v0] TiDB connection closed');
  }
}
