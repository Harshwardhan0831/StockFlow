const passport = require('../config/passport');
const pool = require('../db/connection');
const { signAccessToken, signRefreshToken } = require('../services/tokenService');
const { setAuthCookies } = require('../utils/cookies');

const getFrontendUrl = () => {
  const url = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',')[0].trim() : 'https://stock-flow-eight-umber.vercel.app';
  return url.replace(/\/+$/, '');
};

exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    const frontendBase = getFrontendUrl();
    if (err || !user) {
      return res.redirect(`${frontendBase}/login?error=oauth_failed`);
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, refreshToken]
    );
    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${frontendBase}/dashboard`);
  })(req, res, next);
};
