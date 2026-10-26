/**
 * Technical Analysis and Strategy Calculation Utilities
 */

// Simple Moving Average (SMA)
export function calculateSMA(data, period = 20) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].price;
      }
      sma.push(parseFloat((sum / period).toFixed(2)));
    }
  }
  return sma;
}

// Exponential Moving Average (EMA)
export function calculateEMA(data, period = 50) {
  const ema = [];
  const k = 2 / (period + 1);
  let prevEma = null;

  for (let i = 0; i < data.length; i++) {
    const price = data[i].price;
    if (i < period - 1) {
      ema.push(null);
    } else if (i === period - 1) {
      // First EMA is simple average
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].price;
      }
      prevEma = sum / period;
      ema.push(parseFloat(prevEma.toFixed(2)));
    } else {
      const currentEma = price * k + prevEma * (1 - k);
      prevEma = currentEma;
      ema.push(parseFloat(currentEma.toFixed(2)));
    }
  }
  return ema;
}

// Bollinger Bands (SMA 20 + / - 2 Standard Deviations)
export function calculateBollingerBands(data, period = 20, stdDevMultiplier = 2) {
  const upper = [];
  const middle = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(null);
      middle.push(null);
      lower.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].price;
      }
      const mean = sum / period;

      let varianceSum = 0;
      for (let j = 0; j < period; j++) {
        varianceSum += Math.pow(data[i - j].price - mean, 2);
      }
      const stdDev = Math.sqrt(varianceSum / period);

      upper.push(parseFloat((mean + stdDevMultiplier * stdDev).toFixed(2)));
      middle.push(parseFloat(mean.toFixed(2)));
      lower.push(parseFloat((mean - stdDevMultiplier * stdDev).toFixed(2)));
    }
  }

  return { upper, middle, lower };
}

// Relative Strength Index (RSI 14)
export function calculateRSI(data, period = 14) {
  const rsi = [];
  if (data.length <= period) return rsi;

  const changes = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].price - data[i - 1].price);
  }

  let gains = 0;
  let losses = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] >= 0) gains += changes[i];
    else losses += Math.abs(changes[i]);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // First RSI value corresponds to index `period`
  for (let i = 0; i < period; i++) {
    rsi.push(null);
  }

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let currentRsi = 100 - 100 / (1 + rs);
  rsi.push(parseFloat(currentRsi.toFixed(1)));

  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    currentRsi = 100 - 100 / (1 + rs);
    rsi.push(parseFloat(currentRsi.toFixed(1)));
  }

  return rsi;
}

// Dynamic Support and Resistance Detection
export function calculateSupportResistance(data) {
  if (!data || data.length < 5) return { support: 0, resistance: 0 };
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const current = prices[prices.length - 1];

  // Key cluster levels
  const support = parseFloat((minPrice + (current - minPrice) * 0.25).toFixed(2));
  const resistance = parseFloat((maxPrice - (maxPrice - current) * 0.25).toFixed(2));

  return {
    support: Math.min(support, current * 0.96),
    resistance: Math.max(resistance, current * 1.05),
    low: minPrice,
    high: maxPrice,
  };
}

// Generate algorithmic strategy insights and score
export function evaluateStrategyScore(currentPrice, history, rsiList, sma20List, ema50List) {
  let score = 50; // Neutral base
  const signals = [];

  const lastRsi = rsiList?.filter((v) => v !== null).slice(-1)[0] || 50;
  const lastSma = sma20List?.filter((v) => v !== null).slice(-1)[0] || currentPrice;
  const lastEma = ema50List?.filter((v) => v !== null).slice(-1)[0] || currentPrice;

  // RSI strategy check
  if (lastRsi < 35) {
    score += 20;
    signals.push({ type: 'bullish', title: 'RSI Oversold Dip', desc: `RSI is ${lastRsi} (sub-35). Historical bounce probability is high.` });
  } else if (lastRsi > 70) {
    score -= 18;
    signals.push({ type: 'bearish', title: 'RSI Overbought Alert', desc: `RSI is ${lastRsi} (>70). Consider locking in profits or trailing stop.` });
  } else {
    signals.push({ type: 'neutral', title: 'RSI Momentum Healthy', desc: `RSI is steady at ${lastRsi}. Normal trading range.` });
  }

  // Moving Average crossover check
  if (currentPrice > lastSma && lastSma >= lastEma) {
    score += 22;
    signals.push({ type: 'bullish', title: 'Golden Trend Alignment', desc: 'Price is above 20 SMA, and 20 SMA is comfortably above 50 EMA.' });
  } else if (currentPrice < lastSma && lastSma < lastEma) {
    score -= 20;
    signals.push({ type: 'bearish', title: 'Bearish Trend Drift', desc: 'Price has fallen below 20 SMA and 50 EMA resistance.' });
  } else {
    signals.push({ type: 'neutral', title: 'Consolidation Phase', desc: 'Price is oscillating between 20-day and 50-day moving averages.' });
  }

  // Cap score between 10 and 95
  const finalScore = Math.max(12, Math.min(94, Math.round(score)));
  let sentiment = 'NEUTRAL';
  let color = '#EAB308';
  if (finalScore >= 68) {
    sentiment = 'STRONG BUY';
    color = '#00D09C';
  } else if (finalScore >= 55) {
    sentiment = 'MODERATE BUY';
    color = '#10B981';
  } else if (finalScore <= 35) {
    sentiment = 'STRONG SELL / AVOID';
    color = '#F43F5E';
  } else if (finalScore < 48) {
    sentiment = 'CAUTION';
    color = '#F97316';
  }

  return {
    score: finalScore,
    sentiment,
    color,
    signals,
    lastRsi,
    lastSma,
    lastEma,
  };
}
