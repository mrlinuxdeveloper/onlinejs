function localeFor(req) {
  const cookies = Object.fromEntries((req.get('cookie') || '').split(';').map(part => part.trim().split('=').map(decodeURIComponent)).filter(pair => pair.length === 2));
  const country = (req.get('cf-ipcountry') || req.get('x-vercel-ip-country') || '').toUpperCase();
  const preferred = req.get('accept-language') || '';
  const lang = ['fa', 'en'].includes(cookies.lootlane_lang) ? cookies.lootlane_lang : country === 'IR' || /(^|[,;])\s*fa(?:-|[,;]|$)/i.test(preferred) ? 'fa' : 'en';
  return {
    lang,
    dir: lang === 'fa' ? 'rtl' : 'ltr',
    t: (fa, en) => lang === 'fa' ? fa : en,
    money: amount => new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', { style: 'currency', currency: 'USD' }).format(amount)
  };
}
function setLanguage(req, res) {
  const lang = req.params.lang === 'fa' ? 'fa' : 'en';
  res.cookie('lootlane_lang', lang, { maxAge: 31536000000, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  const referrer = req.get('referer');
  let destination = '/';
  if (referrer) {
    try {
      const parsed = new URL(referrer);
      if (parsed.host === req.get('host')) destination = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (_) {}
  }
  res.redirect(destination);
}
function attachLocale(req, res, next) {
  Object.assign(res.locals, localeFor(req));
  next();
}
module.exports = { attachLocale, localeFor, setLanguage };
