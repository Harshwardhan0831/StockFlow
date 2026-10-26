const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../services/tokenService');
const { setAuthCookies, clearAuthCookies } = require('../utils/cookies');

exports.register = async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, provider) VALUES (?, ?, ?, ?)',
      [email, hash, name || '', 'local']
    );
    const user = { id: result.insertId, email, name: name || '', provider: 'local' };
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, refreshToken]
    );
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ message: 'Registered successfully', user });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND provider = ?',
      [email, 'local']
    );
    const user = rows[0];
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, refreshToken]
    );
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ message: 'Logged in successfully', user: payload });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const [rows] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [refreshToken]
    );
    if (!rows.length) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    const [users] = await pool.query(
      'SELECT id, email, name, provider FROM users WHERE id = ?',
      [decoded.id]
    );
    if (!users.length) {
      return res.status(403).json({ message: 'User not found' });
    }
    const user = users[0];
    await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, newRefreshToken]
    );
    setAuthCookies(res, accessToken, newRefreshToken);
    res.json({ message: 'Token refreshed', user });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]).catch(() => {});
  }
  clearAuthCookies(res);
  res.json({ message: 'Logged out successfully' });
};

exports.me = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, name, provider, avatar, is_verified FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};
