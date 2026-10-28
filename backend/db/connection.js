const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'stock_trading',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl:
        process.env.DB_SSL === 'true' ||
        (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')
          ? { rejectUnauthorized: false }
          : undefined,
    };

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
