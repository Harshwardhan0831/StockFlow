require('dotenv').config();

const DEFAULT_STOCKS = [
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

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    avatar VARCHAR(1000),
    provider ENUM('local','google') NOT NULL DEFAULT 'local',
    is_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(2000) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS watchlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_symbol (user_id, symbol)
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    side ENUM('buy','sell') NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,4) NOT NULL,
    total DECIMAL(12,4) NOT NULL,
    status ENUM('pending','filled','cancelled') DEFAULT 'filled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS mock_stocks (
    symbol VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    exchange VARCHAR(50),
    sector VARCHAR(100),
    current_price DECIMAL(12,4) NOT NULL,
    previous_close DECIMAL(12,4),
    change_amount DECIMAL(12,4),
    change_percent DECIMAL(8,4),
    volume BIGINT,
    market_cap BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
];

async function initDb(existingPool) {
  const pool = existingPool || require('./connection');
  console.log('Ensuring database schema exists...');

  for (const tableSql of TABLES) {
    await pool.query(tableSql);
  }

  const [stockRows] = await pool.query('SELECT COUNT(*) AS cnt FROM mock_stocks');
  if (stockRows[0].cnt === 0) {
    await pool.query(
      'INSERT INTO mock_stocks (symbol, name, exchange, sector, current_price, previous_close, change_amount, change_percent, volume, market_cap) VALUES ?',
      [DEFAULT_STOCKS]
    );
    console.log('Mock stocks seeded');
  }

  console.log('Database tables verified / initialized successfully');
}

module.exports = { initDb };

if (require.main === module) {
  initDb()
    .then(() => {
      console.log('Init script completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}
