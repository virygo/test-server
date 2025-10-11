// src/middlewares/lang.js
// Ορίζει req.lang από ?lang= ή από header Accept-Language.
// Επιτρέπεται: 'el' και 'en'. Default: 'en'.
module.exports = function langMiddleware(req, _res, next) {
  const fromQuery = (req.query?.lang || '').toLowerCase(); // π.χ. /path?lang=el
  const fromHeader = (req.header('Accept-Language') || '').toLowerCase(); // π.χ. 'el' ή 'en'

  const pick = (val) => (val === 'el' || val === 'en' ? val : null);

  // 🛠 Το σωστό: γράφουμε στο req.lang (ΟΧΙ req_lang)
  req.lang = pick(fromQuery) || pick(fromHeader) || 'en';

  next();
};
