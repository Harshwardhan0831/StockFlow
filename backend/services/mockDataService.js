const stockMetadata = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ', high52: 237.23, low52: 164.08, pe: 32.4, marketCap: '3.42T', desc: 'Consumer electronics, software, and online services leader.' },
  MSFT: { name: 'Microsoft Corp.', sector: 'Technology', exchange: 'NASDAQ', high52: 468.35, low52: 366.50, pe: 35.8, marketCap: '3.15T', desc: 'Enterprise software, Azure cloud computing, and AI solutions.' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', exchange: 'NASDAQ', high52: 191.75, low52: 129.40, pe: 24.1, marketCap: '2.05T', desc: 'Search, cloud infrastructure, YouTube, and generative AI.' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', exchange: 'NASDAQ', high52: 201.20, low52: 118.35, pe: 41.2, marketCap: '1.98T', desc: 'Global e-commerce marketplace and AWS cloud computing.' },
  TSLA: { name: 'Tesla Inc.', sector: 'Automotive', exchange: 'NASDAQ', high52: 271.00, low52: 138.80, pe: 64.5, marketCap: '780B', desc: 'Electric vehicles, energy storage, and autonomous driving AI.' },
  NVDA: { name: 'NVIDIA Corp.', sector: 'Semiconductors', exchange: 'NASDAQ', high52: 140.76, low52: 39.23, pe: 52.3, marketCap: '2.95T', desc: 'Accelerated computing, GPUs, and enterprise AI accelerators.' },
  META: { name: 'Meta Platforms Inc.', sector: 'Communication', exchange: 'NASDAQ', high52: 602.95, low52: 279.40, pe: 27.8, marketCap: '1.45T', desc: 'Social connection technologies including Instagram, WhatsApp, and Llama AI.' },
  NFLX: { name: 'Netflix Inc.', sector: 'Communication', exchange: 'NASDAQ', high52: 725.50, low52: 375.20, pe: 42.1, marketCap: '310B', desc: 'Subscription streaming entertainment and original content producer.' },
  AMD: { name: 'Advanced Micro Devices', sector: 'Semiconductors', exchange: 'NASDAQ', high52: 227.30, low52: 94.04, pe: 45.7, marketCap: '255B', desc: 'High-performance processors, Radeon graphics, and datacenter chips.' },
  INTC: { name: 'Intel Corp.', sector: 'Semiconductors', exchange: 'NASDAQ', high52: 51.28, low52: 18.51, pe: 29.3, marketCap: '95B', desc: 'Semiconductor design and manufacturing foundries worldwide.' },
};

const symbols = Object.keys(stockMetadata);

const basePrices = {
  AAPL: 185.50,
  MSFT: 380.25,
  GOOGL: 142.75,
  AMZN: 178.90,
  TSLA: 245.30,
  NVDA: 875.40,
  META: 495.60,
  NFLX: 625.15,
  AMD: 155.80,
  INTC: 42.50,
};

function generateStocks() {
  return symbols.map((symbol) => {
    const meta = stockMetadata[symbol] || {};
    const base = basePrices[symbol] || 100;
    const change = (Math.random() * 8 - 3.8).toFixed(2);
    const price = parseFloat((base + parseFloat(change)).toFixed(2));
    const dayHigh = parseFloat((price + Math.abs(parseFloat(change)) * 0.8 + Math.random() * 2).toFixed(2));
    const dayLow = parseFloat((price - Math.abs(parseFloat(change)) * 0.8 - Math.random() * 2).toFixed(2));

    return {
      symbol,
      name: meta.name || symbol,
      sector: meta.sector || 'Technology',
      exchange: meta.exchange || 'NASDAQ',
      price,
      change: parseFloat(change),
      changePercent: ((change / base) * 100).toFixed(2),
      dayHigh,
      dayLow,
      high52: meta.high52 || (base * 1.3).toFixed(2),
      low52: meta.low52 || (base * 0.7).toFixed(2),
      pe: meta.pe || 30.0,
      marketCap: meta.marketCap || '100B',
      desc: meta.desc || '',
      volume: Math.floor(Math.random() * 40000000 + 10000000),
      updatedAt: new Date().toISOString(),
    };
  });
}

function getQuote(symbol) {
  const meta = stockMetadata[symbol] || {};
  const base = basePrices[symbol] || 100;
  const change = (Math.random() * 8 - 3.8).toFixed(2);
  const price = parseFloat((base + parseFloat(change)).toFixed(2));
  const dayHigh = parseFloat((price + Math.abs(parseFloat(change)) * 0.8 + Math.random() * 2).toFixed(2));
  const dayLow = parseFloat((price - Math.abs(parseFloat(change)) * 0.8 - Math.random() * 2).toFixed(2));

  return {
    symbol,
    name: meta.name || symbol,
    sector: meta.sector || 'Technology',
    exchange: meta.exchange || 'NASDAQ',
    price,
    change: parseFloat(change),
    changePercent: ((change / base) * 100).toFixed(2),
    dayHigh,
    dayLow,
    high52: meta.high52 || (base * 1.3).toFixed(2),
    low52: meta.low52 || (base * 0.7).toFixed(2),
    pe: meta.pe || 30.0,
    marketCap: meta.marketCap || '100B',
    desc: meta.desc || '',
    volume: Math.floor(Math.random() * 40000000 + 10000000),
    timestamp: new Date().toISOString(),
  };
}

function getHistory(symbol, days = 30) {
  const base = basePrices[symbol] || 100;
  const history = [];
  let price = base * 0.88; // start slightly lower to show trend
  const now = Date.now();
  const stepMs = (days <= 7 ? 2 : days <= 30 ? 24 : days <= 90 ? 48 : 72) * 60 * 60 * 1000;
  const count = Math.min(days, 60);

  for (let i = count - 1; i >= 0; i--) {
    const drift = (Math.random() * 0.045 - 0.021);
    price = Math.max(10, price * (1 + drift));
    const high = price * (1 + Math.random() * 0.015);
    const low = price * (1 - Math.random() * 0.015);
    const dateObj = new Date(now - i * (days * 24 * 60 * 60 * 1000) / count);
    
    // Format label: time if 1-7 days, else date
    const label = days <= 2
      ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    history.push({
      time: label,
      fullDate: dateObj.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume: Math.floor(Math.random() * 12000000 + 2000000),
    });
  }
  return history;
}

module.exports = { generateStocks, getQuote, getHistory, symbols, stockMetadata };
