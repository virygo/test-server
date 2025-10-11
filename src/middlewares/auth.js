// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

// Απαιτεί έγκυρο JWT. Γεμίζει req.user = { id, email, username, role }
function authRequired(req, _res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const [scheme, token] = hdr.split(' ');
    if (scheme !== 'Bearer' || !token) {
      const err = new Error('unauthorized');
      err.status = 401;
      err.ns = 'auth';
      err.key = 'unauthorized';
      return next(err);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error('internal_error');
      err.status = 500;
      err.ns = 'common';
      err.key = 'internal_error';
      return next(err);
    }

    const payload = jwt.verify(token, secret);
    req.user = payload; // { id, email, username, role }
    return next();
  } catch (_e) {
    const err = new Error('invalid_token');
    err.status = 401;
    err.ns = 'auth';
    err.key = 'invalid_token';
    return next(err);
  }
}

// Έλεγχος ρόλων. Παράδειγμα: requireRole('admin'), ή requireRole('admin','vendor')
function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const err = new Error('forbidden');
      err.status = 403;
      err.ns = 'auth';
      err.key = 'forbidden';
      return next(err);
    }
    next();
  };
}

module.exports = { authRequired, requireRole };
