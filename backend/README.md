# Stock Trading Platform - Backend

## Stack
- Node.js + Express.js
- MySQL (mysql2)
- JWT authentication (access + refresh tokens in httpOnly cookies)
- Passport.js (local email/password + Google OAuth)
- WebSocket (`ws`) for real-time market data
- Mock market data service for charts/quotes

## Folder Structure
```
backend/
├── server.js              # Entry point (Express + WebSocket server)
├── .env                   # Environment variables
├── package.json
├── db/                    # MySQL connection, schema, initializer
│   ├── connection.js
│   ├── schema.sql
│   └── init.js
├── config/                # Passport strategies
│   └── passport.js
├── middleware/            # Auth & error handling
│   ├── auth.js
│   └── errorHandler.js
├── controllers/           # Route handlers
│   ├── authController.js
│   ├── oauthController.js
│   └── marketController.js
├── services/              # JWT tokens & mock market data
│   ├── tokenService.js
│   └── mockDataService.js
├── sockets/               # WebSocket market feed
│   └── marketSocket.js
├── routes/                # API routes
│   ├── index.js
│   ├── authRoutes.js
│   ├── oauthRoutes.js
│   └── marketRoutes.js
└── utils/                 # Cookies, async handler, AppError
    ├── cookies.js
    ├── asyncHandler.js
    └── AppError.js
```

## Setup

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Copy environment variables:
   ```
   copy .env.example .env   # Windows
   # or
   cp .env.example .env     # Mac/Linux
   ```
   Fill in `DB_PASSWORD`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and JWT secrets.

3. Ensure MySQL is running, then initialize the database:
   ```
   npm run init-db
   ```

4. Start the server:
   ```
   npm run dev      # with nodemon
   # or
   npm start
   ```

Server: `http://localhost:5000`
WebSocket: `ws://localhost:5000/ws`

## API Endpoints

### Auth (email/password + JWT)
- `POST /api/auth/register` - register (email, password, name)
- `POST /api/auth/login` - login (email, password) -> sets httpOnly cookies
- `POST /api/auth/refresh` - refresh access token using refresh_token cookie
- `POST /api/auth/logout` - logout (requires access_token cookie)
- `GET /api/auth/me` - current user (requires access_token cookie)

### OAuth (Google)
- `GET /api/oauth/google` - start Google OAuth
- `GET /api/oauth/google/callback` - Google callback -> sets cookies, redirects to frontend

### Market (mock real-time data)
- `GET /api/market/stocks` - list of mock stocks
- `GET /api/market/stocks/:symbol/quote` - current quote for a symbol
- `GET /api/market/stocks/:symbol/history?days=30` - history for charts (Chart.js)
- `GET /api/health` - health check

### WebSocket
Connect to `ws://localhost:5000/ws?token=<access_token>`
- Server broadcasts quotes every 3 seconds.
- Client can send `{ type: 'subscribe', symbol: 'AAPL' }` to filter by symbol.

## Authentication
- Access token: httpOnly cookie `access_token`, 15 min expiry.
- Refresh token: httpOnly cookie `refresh_token`, 7 day expiry, stored in DB (rotated on use).
- Protected routes require the `access_token` cookie.
