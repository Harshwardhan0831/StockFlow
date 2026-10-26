const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../db/connection');

passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });
    return done(null, user);
  } catch (err) { return done(err); }
}));

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);
    let user = rows[0];
    if (!user && email) {
      const [emailRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      user = emailRows[0];
      if (user) {
        await pool.query(
          'UPDATE users SET google_id = ?, provider = ?, avatar = ? WHERE id = ?',
          [profile.id, 'google', profile.photos && profile.photos[0] ? profile.photos[0].value : null, user.id]
        );
        user = { ...user, google_id: profile.id, provider: 'google' };
      }
    }
    if (!user) {
      const [result] = await pool.query(
        'INSERT INTO users (email, name, google_id, provider, avatar, is_verified) VALUES (?, ?, ?, ?, ?, 1)',
        [email, profile.displayName, profile.id, 'google', profile.photos && profile.photos[0] ? profile.photos[0].value : null]
      );
      user = { id: result.insertId, email, name: profile.displayName, google_id: profile.id, provider: 'google' };
    }
    return done(null, user);
  } catch (err) { return done(err); }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT id, email, name, provider, avatar FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (err) { done(err); }
});

module.exports = passport;
