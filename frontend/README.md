# StockFlow Frontend

## Stack
- React 18 (Vite)
- Material UI (MUI v5) + Tailwind CSS
- Redux Toolkit + React Redux (central store)
- Axios (API client with JWT cookie handling + 401 refresh interceptor)
- React Router DOM (navigation)
- Chart.js + react-chartjs-2 (candlestick/line charts)

## Folder Structure
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── theme.js                 # MUI theme with ColorHunt palette
│   ├── hooks/
│   │   └── useAuth.js
│   ├── store/
│   │   ├── api.js               # Axios instance (withCredentials, 401 refresh)
│   │   ├── index.js             # Redux store
│   │   └── slices/
│   │       ├── authSlice.js     # login/register/logout/fetchMe
│   │       └── marketSlice.js   # stocks/quote/history
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Layout.jsx
│   │   ├── LandingPage.jsx
│   │   ├── StockListing.jsx
│   │   ├── StockChart.jsx
│   │   ├── BuySellPanel.jsx
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   └── ProtectedRoute.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Dashboard.jsx
│       ├── Login.jsx
│       └── Register.jsx
```

## Color Theme (ColorHunt: 3368a066a3bfc8dfdbf2efe7)
- Primary: `#3368A0`
- Secondary: `#66A3BF`
- Surface: `#C8DFDB`
- Background: `#F2EFE7`

## Setup
1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start dev server:
   ```
   npm run dev
   ```
   Frontend: `http://localhost:3000`
   Proxies `/api` and `/ws` to backend `http://localhost:5000`.

3. Make sure the backend is running (`backend/` folder) and MySQL is initialized.

## Features
- Landing page with navbar (Home, Features, Log in, Sign up)
- JWT auth (email/password) stored in httpOnly cookies via Redux
- Stock listing with names & current prices; click to view Chart.js chart
- Buy/Sell dashboard with quantity & price inputs, order placement
- Protected dashboard route; auto-redirects to login when unauthenticated
- Google OAuth ready (backend `/api/oauth/google`)
