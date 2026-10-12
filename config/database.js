const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const dbFile = path.resolve(process.env.SQLITE_FILE || path.join(__dirname, '..', 'data', 'marketplace.sqlite'));
fs.mkdirSync(path.dirname(dbFile), { recursive: true });
const db = new DatabaseSync(dbFile);
db.exec(`PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS listings (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL, game TEXT NOT NULL, platform TEXT NOT NULL,
 category TEXT NOT NULL, price REAL NOT NULL CHECK(price > 0), currency TEXT NOT NULL DEFAULT 'USD',
 rarity TEXT NOT NULL DEFAULT 'Rare', seller TEXT NOT NULL, image TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'active',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS listings_status_created ON listings(status, created_at DESC);`);
const count = db.prepare('SELECT COUNT(*) AS count FROM listings').get().count;
if (!count) {
 const seed = db.prepare('INSERT INTO listings (title,game,platform,category,price,rarity,seller,image,description) VALUES (?,?,?,?,?,?,?,?,?)');
 [
  ['Dragonfire Blade','Elden Ring','PC','Weapon',42.5,'Legendary','Mika','https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85','A forged blade with a warm ember glow.'],
  ['Neon Drift Pack','Cyberpunk 2077','PC','Cosmetic',18,'Epic','Rin','https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=85','Chrome finish, limited street look.'],
  ['Aether Wings','Final Fantasy XIV','PC','Cosmetic',65,'Mythic','Kira','https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85','Celestial wings with a soft blue trail.'],
  ['Ancient Relic','Dota 2','PC','Collectible',27.9,'Rare','Nova','https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=900&q=85','A mysterious relic from an older season.'],
  ['Crimson Reaver','Valorant','PC','Weapon skin',34,'Epic','Ash','https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85','A bold red finish for your loadout.'],
  ['Frostbound Shield','World of Warcraft','PC','Armor',51,'Legendary','Lynx','https://images.unsplash.com/photo-1514533212735-5df27d970db0?auto=format&fit=crop&w=900&q=85','Ice-carved shield, battle tested.']
 ].forEach(row => seed.run(...row));
}
module.exports = { db, initDatabase: () => db };
