const pool = require('../db/connection');

const INITIAL_CASH = 50000.0;

function calculatePortfolio(orders) {
  let cashBalance = INITIAL_CASH;
  const holdings = {};

  // Sort orders chronologically ascending
  const chronological = [...orders].sort((a, b) => {
    const timeDiff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.id - b.id;
  });

  for (const ord of chronological) {
    const sym = ord.symbol.toUpperCase();
    const qty = parseInt(ord.quantity, 10);
    const prc = parseFloat(ord.price);
    const total = parseFloat(ord.total);
    const side = String(ord.side).toLowerCase();
    const name = ord.name || sym;

    if (side === 'buy') {
      cashBalance -= total;
      if (holdings[sym]) {
        const newQty = holdings[sym].quantity + qty;
        const newInvested = holdings[sym].totalInvested + total;
        holdings[sym] = {
          symbol: sym,
          name,
          quantity: newQty,
          totalInvested: parseFloat(newInvested.toFixed(2)),
          avgPrice: parseFloat((newInvested / newQty).toFixed(2)),
        };
      } else {
        holdings[sym] = {
          symbol: sym,
          name,
          quantity: qty,
          totalInvested: total,
          avgPrice: prc,
        };
      }
    } else if (side === 'sell') {
      cashBalance += total;
      if (holdings[sym]) {
        const remainingQty = holdings[sym].quantity - qty;
        if (remainingQty <= 0) {
          delete holdings[sym];
        } else {
          const remainingCost = parseFloat((remainingQty * holdings[sym].avgPrice).toFixed(2));
          holdings[sym] = {
            ...holdings[sym],
            quantity: remainingQty,
            totalInvested: remainingCost,
          };
        }
      }
    }
  }

  return {
    cashBalance: parseFloat(cashBalance.toFixed(2)),
    holdings,
  };
}

exports.placeOrder = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { symbol, side, quantity, price } = req.body;
  if (!symbol || !side || quantity == null || price == null) {
    return res.status(400).json({ message: 'symbol, side, quantity, and price are required' });
  }

  const normalizedSide = String(side).toLowerCase();
  if (!['buy', 'sell'].includes(normalizedSide)) {
    return res.status(400).json({ message: "side must be 'buy' or 'sell'" });
  }

  const qty = parseInt(quantity, 10);
  const prc = parseFloat(price);

  if (isNaN(qty) || qty <= 0 || isNaN(prc) || prc <= 0) {
    return res.status(400).json({ message: 'Invalid order quantity or price' });
  }

  const total = parseFloat((qty * prc).toFixed(2));
  const sym = symbol.toUpperCase().trim();

  try {
    // Fetch previous user orders to validate available cash and owned shares
    const [existingOrders] = await pool.query(
      `SELECT o.*, COALESCE(s.name, o.symbol) AS name 
       FROM orders o 
       LEFT JOIN mock_stocks s ON o.symbol = s.symbol 
       WHERE o.user_id = ? 
       ORDER BY o.created_at ASC, o.id ASC`,
      [user.id]
    );

    const { cashBalance, holdings } = calculatePortfolio(existingOrders);

    if (normalizedSide === 'buy') {
      if (total > cashBalance) {
        return res.status(400).json({
          message: `Insufficient Funds. Required: $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}, Available: $${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        });
      }
    } else if (normalizedSide === 'sell') {
      const owned = holdings[sym]?.quantity || 0;
      if (qty > owned) {
        return res.status(400).json({
          message: `You do not own enough shares of ${sym} to sell. Owned: ${owned}`,
        });
      }
    }

    const [result] = await pool.query(
      'INSERT INTO orders (user_id, symbol, side, quantity, price, total, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.id, sym, normalizedSide, qty, prc, total, 'filled']
    );

    const [insertedRows] = await pool.query(
      `SELECT o.*, COALESCE(s.name, o.symbol) AS name 
       FROM orders o 
       LEFT JOIN mock_stocks s ON o.symbol = s.symbol 
       WHERE o.id = ?`,
      [result.insertId]
    );

    const updatedOrders = [...existingOrders, insertedRows[0]];
    const updatedPortfolio = calculatePortfolio(updatedOrders);

    res.status(201).json({
      message: 'Order placed successfully',
      order: insertedRows[0],
      cashBalance: updatedPortfolio.cashBalance,
      holdings: updatedPortfolio.holdings,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  const { user } = req;
  try {
    const [rows] = await pool.query(
      `SELECT o.*, COALESCE(s.name, o.symbol) AS name 
       FROM orders o 
       LEFT JOIN mock_stocks s ON o.symbol = s.symbol 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC, o.id DESC`,
      [user.id]
    );

    const portfolio = calculatePortfolio(rows);

    res.json({
      orders: rows,
      cashBalance: portfolio.cashBalance,
      holdings: portfolio.holdings,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetOrders = async (req, res, next) => {
  const { user } = req;
  try {
    await pool.query('DELETE FROM orders WHERE user_id = ?', [user.id]);
    res.json({
      message: 'Orders reset successfully',
      orders: [],
      cashBalance: INITIAL_CASH,
      holdings: {},
    });
  } catch (err) {
    next(err);
  }
};
