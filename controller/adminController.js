const crypto = require('node:crypto');
const Listing = require('../models/listing');
const { localeFor } = require('../middleware/locale');

const COOKIE = 'lootlane_admin';
const attempts = new Map();
const credentials = () => ({
  username: process.env.ADMIN_USERNAME || (process.env.NODE_ENV === 'production' ? '' : 'admin'),
  password: process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'DemoAdmin!2026'),
  secret: process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'lootlane-local-demo-session-secret'
});
function signature(value) { return crypto.createHmac('sha256', credentials().secret).update(value).digest('base64url'); }
function readCookie(req) {
  const entry = (req.get('cookie') || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(COOKIE.length + 1)) : '';
}
function validSession(req) {
  const [expires, sig] = readCookie(req).split('.');
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  const expected = signature(expires);
  const actualBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
function requireAdmin(req, res, next) { return validSession(req) ? next() : res.redirect('/admin/login'); }
function loginPage(req, res) {
  if (validSession(req)) return res.redirect('/admin');
  res.render('admin-login', { ...localeFor(req), error: null });
}
function login(req, res) {
  const key = req.ip;
  const state = attempts.get(key) || { count: 0, until: 0 };
  const config = credentials();
  const blocked = state.until > Date.now();
  const inputUser = String(req.body.username || '');
  const inputPass = String(req.body.password || '');
  const ok = !blocked && config.username && config.password && inputUser === config.username && inputPass.length === config.password.length && crypto.timingSafeEqual(Buffer.from(inputPass), Buffer.from(config.password));
  if (!ok) {
    state.count += 1;
    if (state.count >= 5) { state.count = 0; state.until = Date.now() + 10 * 60 * 1000; }
    attempts.set(key, state);
    return res.status(blocked ? 429 : 401).render('admin-login', { ...localeFor(req), error: localeFor(req).t('نام کاربری یا رمز عبور درست نیست.','The username or password is incorrect.') });
  }
  attempts.delete(key);
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  res.cookie(COOKIE, `${expires}.${signature(expires)}`, { maxAge: 8 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' });
  res.redirect('/admin');
}
function logout(req, res) { res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' }); res.redirect('/'); }
function dashboard(req, res) { res.render('admin', { ...localeFor(req), listings: Listing.adminAll(), stats: Listing.stats(), notice: req.query.notice || '' }); }
function updateStatus(req, res) {
  const id = Number(req.params.id);
  if (Number.isInteger(id) && id > 0 && ['active', 'sold', 'hidden'].includes(req.body.status)) Listing.setStatus(id, req.body.status);
  res.redirect('/admin?notice=updated');
}
function deleteListing(req, res) {
  const id = Number(req.params.id);
  if (Number.isInteger(id) && id > 0) Listing.remove(id);
  res.redirect('/admin?notice=deleted');
}
module.exports = { loginPage, login, logout, requireAdmin, dashboard, updateStatus, deleteListing };
