// src/validators/userValidators.js

// απλά, ασφαλή regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 3–30 chars, γράμματα/αριθμοί/._-
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,30}$/;
// τουλάχιστον 8 chars, τουλάχιστον 1 γράμμα και 1 αριθμός (έως 64)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)\S{8,64}$/;

function validateUserCreate(req, _res, next) {
  const { email, name, username, password } = req.body || {};

  // 1) email
  if (!email) {
    const err = new Error('email is required');
    err.status = 400;
    err.ns = 'users';
    err.key = 'required_email';
    return next(err);
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    const err = new Error('invalid email format');
    err.status = 400;
    err.ns = 'users';
    err.key = 'invalid_email';
    return next(err);
  }

  // 2) name
  if (!name || typeof name !== 'string' || !name.trim()) {
    const err = new Error('name is required');
    err.status = 400;
    err.ns = 'users';
    err.key = 'required_name';
    return next(err);
  }

  // 3) username
  if (!username) {
    const err = new Error('username is required');
    err.status = 400;
    err.ns = 'users';
    err.key = 'required_username';
    return next(err);
  }
  if (typeof username !== 'string' || !USERNAME_REGEX.test(username)) {
    const err = new Error('invalid username format');
    err.status = 400;
    err.ns = 'users';
    err.key = 'invalid_username';
    return next(err);
  }

  // 4) password
  if (!password) {
    const err = new Error('password is required');
    err.status = 400;
    err.ns = 'users';
    err.key = 'required_password';
    return next(err);
  }
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    const err = new Error('weak password');
    err.status = 400;
    err.ns = 'users';
    err.key = 'weak_password';
    return next(err);
  }

  // όλα ΟΚ
  return next();
}

module.exports = { validateUserCreate };
