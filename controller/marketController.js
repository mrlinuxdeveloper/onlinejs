const Listing = require('../models/listing');
const { localeFor } = require('../middleware/locale');
const categories = ['Weapon', 'Cosmetic', 'Collectible', 'Armor', 'Currency', 'Other'];
function home(req, res) {
  const filters = { query: (req.query.q || '').trim().slice(0, 80), game: (req.query.game || '').trim().slice(0, 80) };
  res.render('index', { ...localeFor(req), listings: Listing.all(filters), games: Listing.games(), filters });
}
function dashboard(req, res) { res.render('dashboard', { ...localeFor(req), listings: Listing.mine(), query: req.query, error: null }); }
function create(req, res) {
  const item = {
    title: (req.body.title || '').trim().slice(0, 80), game: (req.body.game || '').trim().slice(0, 60),
    platform: (req.body.platform || '').trim().slice(0, 40), category: categories.includes(req.body.category) ? req.body.category : 'Other',
    price: Number(req.body.price), rarity: ['Common','Rare','Epic','Legendary','Mythic'].includes(req.body.rarity) ? req.body.rarity : 'Rare',
    image: (req.body.image || '').trim(), description: (req.body.description || '').trim().slice(0, 300)
  };
  if (!item.title || !item.game || !item.platform || !Number.isFinite(item.price) || item.price <= 0 || item.price > 100000 || !/^https:\/\//.test(item.image)) {
    return res.status(400).render('dashboard', { ...localeFor(req), listings: Listing.mine(), query: {}, error: localeFor(req).t('لطفاً اطلاعات معتبر وارد کنید. لینک تصویر باید با https شروع شود.','Please enter valid details. Image URL must start with https.') });
  }
  Listing.create(item);
  res.redirect('/dashboard?created=1');
}
function buy(req, res) {
  const id = Number(req.params.id);
  if (Number.isInteger(id) && id > 0) Listing.buy(id);
  res.redirect('/?purchased=1');
}
module.exports = { home, dashboard, create, buy };
