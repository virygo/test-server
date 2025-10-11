// src/validators/authValidators.js
function validateLogin(req, _res, next) {
  const { email, username, password } = req.body || {};

  // πρέπει να δοθεί είτε email είτε username
  if (
    (!email && !username) ||
    (email && typeof email !== 'string') ||
    (username && typeof username !== 'string')
  ) {
    const err = new Error('missing credentials');
    err.status = 400;
    err.ns = 'auth';
    err.key = 'missing_credentials';
    return next(err);
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    const err = new Error('password is required');
    err.status = 400;
    err.ns = 'auth';
    err.key = 'required_password';
    return next(err);
  }

  return next();
}
module.exports = { validateLogin };
