require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { WebSocketServer } = require('ws');

const pool = require('./db/connection');
require('./config/passport');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { setupWebSocket } = require('./sockets/marketSocket');

const app = express();

// Trust proxy headers on hosted platforms (e.g., Render, Railway) so secure cookies & HTTPS detection work
app.set('trust proxy', 1);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

setupWebSocket(wss);

const PORT = process.env.PORT || 5000;

// Parse FRONTEND_URL supporting comma-separated values and trailing slash stripping
const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultOrigins = [
  'https://stock-flow-eight-umber.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
];

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow same-origin, curl, Postman, server-to-server requests
  const cleanOrigin = origin.replace(/\/+$/, '');
  if (allowedOrigins.includes(cleanOrigin)) return true;
  // Allow all Vercel deployments and preview URLs
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(cleanOrigin)) return true;
  return false;
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use(errorHandler);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
});
