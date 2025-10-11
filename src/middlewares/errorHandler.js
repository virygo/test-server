// src/middlewares/errorHandler.js
const { t } = require('../i18n/messages');

/**
 * Μετατρέπει οποιοδήποτε error σε { status, body } για να σταλεί στον client
 */
function normalizeError(err, req) {
  // 1) Prisma unique constraint (duplicate)
  if (err?.code === 'P2002') {
    // Prisma μπορεί να δώσει target ως array (['email'] ή ['username'])
    // ή ως όνομα constraint (π.χ. 'User_email_key'). Ενώνουμε/χαμηλώνουμε.
    const rawTarget = Array.isArray(err.meta?.target)
      ? err.meta.target.join('_')
      : err.meta?.target || '';
    const tstr = String(rawTarget).toLowerCase();

    // Διάλεξε σωστό μήνυμα
    let key = 'already_exists'; // fallback αν δεν αναγνωρίσουμε πεδίο
    if (tstr.includes('email')) key = 'email_exists';
    else if (tstr.includes('username')) key = 'username_exists';

    return {
      status: 400,
      body: { error: t(req.lang, 'users', key) },
    };
  }

  // 2) Σκόπιμα errors από validators/route-handlers (π.χ. throw {status, key})
  if (typeof err?.status === 'number') {
    return {
      status: err.status,
      body: {
        error: err.key
          ? t(req.lang, err.ns || 'common', err.key, err.vars || {})
          : err.message || 'Error',
      },
    };
  }

  // 3) Προεπιλογή: 500
  return {
    status: 500,
    body: { error: t(req.lang, 'common', 'internal_error') },
  };
}

/**
 * Express error-handling middleware (4 ορίσματα)
 */
module.exports = (err, req, res, _next) => {
  // Προαιρετικό logging στο terminal
  console.error('ERROR:', {
    message: err?.message,
    code: err?.code,
    meta: err?.meta,
    method: req.method,
    path: req.path,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
  });

  const { status, body } = normalizeError(err, req);
  res.status(status).json(body);
};
