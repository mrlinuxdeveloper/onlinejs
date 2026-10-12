const { db } = require('../config/database');
const Listing = {
  all({ query = '', game = '' } = {}) {
    return db.prepare(`SELECT * FROM listings WHERE status='active' AND (?='' OR title LIKE ? OR game LIKE ? OR category LIKE ?) AND (?='' OR game=?) ORDER BY created_at DESC, id DESC`)
      .all(query, `%${query}%`, `%${query}%`, `%${query}%`, game, game);
  },
  games() { return db.prepare("SELECT DISTINCT game FROM listings WHERE status='active' ORDER BY game").all().map(row => row.game); },
  byId(id) { return db.prepare('SELECT * FROM listings WHERE id=?').get(id); },
  adminAll() { return db.prepare('SELECT * FROM listings ORDER BY created_at DESC, id DESC LIMIT 100').all(); },
  stats() { return db.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN status='sold' THEN 1 ELSE 0 END) AS sold FROM listings").get(); },
  mine() { return db.prepare("SELECT * FROM listings WHERE seller='You' ORDER BY created_at DESC").all(); },
  create(item) {
    return db.prepare('INSERT INTO listings (title,game,platform,category,price,rarity,seller,image,description) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(item.title, item.game, item.platform, item.category, item.price, item.rarity, 'You', item.image, item.description);
  },
  buy(id) { return db.prepare("UPDATE listings SET status='sold' WHERE id=? AND status='active' AND seller!='You'").run(id); },
  setStatus(id, status) { return db.prepare("UPDATE listings SET status=? WHERE id=?").run(status, id); },
  remove(id) { return db.prepare('DELETE FROM listings WHERE id=?').run(id); }
};
module.exports = Listing;
