const jwt = require('jsonwebtoken');
const { generateStocks } = require('../services/mockDataService');

function setupWebSocket(wss) {
  wss.on('connection', (ws, req) => {
    let user = null;
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        user = { id: decoded.id, email: decoded.email };
      }
    } catch (e) {}

    const subscribed = new Set();

    const pushQuotes = () => {
      const stocks = generateStocks();
      const payload = JSON.stringify({ type: 'quotes', data: stocks, timestamp: new Date().toISOString() });
      if (subscribed.size === 0) {
        ws.send(payload);
      } else {
        ws.send(
          JSON.stringify({
            type: 'quotes',
            data: stocks.filter((s) => subscribed.has(s.symbol)),
            timestamp: new Date().toISOString(),
          })
        );
      }
    };

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'subscribe' && msg.symbol) subscribed.add(msg.symbol.toUpperCase());
        if (msg.type === 'unsubscribe' && msg.symbol) subscribed.delete(msg.symbol.toUpperCase());
      } catch (e) {}
    });

    ws.send(JSON.stringify({ type: 'connected', authenticated: !!user, user }));

    const interval = setInterval(pushQuotes, 3000);
    ws.on('close', () => clearInterval(interval));
    ws.on('error', () => clearInterval(interval));
  });
}

module.exports = { setupWebSocket };
