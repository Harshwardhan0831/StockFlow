const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function init() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'stock_trading'}\``);
  await connection.query(`USE \`${process.env.DB_NAME || 'stock_trading'}\``);

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await connection.query(schema);

  const [stockRows] = await connection.query('SELECT COUNT(*) AS cnt FROM mock_stocks');
  if (stockRows[0].cnt === 0) {
    const stocks = [
      ['AAPL', 'Apple Inc.', 'NASDAQ', 'Technology', 185.50, 184.20, 1.30, 0.70, 52000000, 2900000000000],
      ['MSFT', 'Microsoft Corp.', 'NASDAQ', 'Technology', 380.25, 378.90, 1.35, 0.36, 38000000, 2820000000000],
      ['GOOGL', 'Alphabet Inc.', 'NASDAQ', 'Communication', 142.75, 141.50, 1.25, 0.88, 29000000, 1780000000000],
      ['AMZN', 'Amazon.com Inc.', 'NASDAQ', 'Consumer Cyclical', 178.90, 177.40, 1.50, 0.85, 44000000, 1860000000000],
      ['TSLA', 'Tesla Inc.', 'NASDAQ', 'Automotive', 245.30, 243.80, 1.50, 0.62, 110000000, 780000000000],
      ['NVDA', 'NVIDIA Corp.', 'NASDAQ', 'Technology', 875.40, 870.20, 5.20, 0.60, 55000000, 2200000000000],
      ['META', 'Meta Platforms Inc.', 'NASDAQ', 'Communication', 495.60, 493.10, 2.50, 0.51, 21000000, 1250000000000],
      ['NFLX', 'Netflix Inc.', 'NASDAQ', 'Communication', 625.15, 622.30, 2.85, 0.46, 5000000, 280000000000],
      ['AMD', 'Advanced Micro Devices', 'NASDAQ', 'Technology', 155.80, 154.90, 0.90, 0.58, 72000000, 240000000000],
      ['INTC', 'Intel Corp.', 'NASDAQ', 'Technology', 42.50, 42.80, -0.30, -0.70, 88000000, 180000000000],
    ];
    await connection.query(
      'INSERT INTO mock_stocks (symbol, name, exchange, sector, current_price, previous_close, change_amount, change_percent, volume, market_cap) VALUES ?',
      [stocks]
    );
  }

  await connection.end();
  console.log('Database initialized successfully');
}

init().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
