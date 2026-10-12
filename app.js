require('dotenv').config();
const express = require('express');
const path = require('path');
const { initDatabase } = require('./config/database');
const marketRoutes = require('./router/marketRoutes');
const { attachLocale, localeFor } = require('./middleware/locale');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(attachLocale);
app.use('/', marketRoutes);
app.use((req, res) => res.status(404).render('404', localeFor(req)));

if (require.main === module) {
  initDatabase();
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`Lootlane is ready at http://localhost:${port}`));
}

module.exports = app;
