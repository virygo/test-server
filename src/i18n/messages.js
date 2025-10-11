// src/i18n/messages.js
const MESSAGES = {
  common: {
    internal_error: {
      en: 'Internal Server Error',
      el: 'Εσωτερικό σφάλμα διακομιστή',
    },
  },
  users: {
    // email
    required_email: {
      en: 'email is required',
      el: 'το email είναι υποχρεωτικό',
    },
    invalid_email: { en: 'invalid email format', el: 'μη έγκυρη μορφή email' },
    email_exists: { en: 'email already exists', el: 'το email υπάρχει ήδη' },

    username_exists: {
      en: 'username already exists',
      el: 'το username υπάρχει ήδη',
    },

    // name
    required_name: { en: 'name is required', el: 'το όνομα είναι υποχρεωτικό' },

    // username
    required_username: {
      en: 'username is required',
      el: 'το username είναι υποχρεωτικό',
    },
    invalid_username: {
      en: 'invalid username format',
      el: 'μη έγκυρη μορφή username',
    },

    // password
    required_password: {
      en: 'password is required',
      el: 'ο κωδικός είναι υποχρεωτικός',
    },
    weak_password: {
      en: 'weak password',
      el: 'αδύναμος κωδικός (γράμματα + αριθμοί)',
    },

    // success
    created: { en: 'user created', el: 'ο χρήστης δημιουργήθηκε' },
  },

  auth: {
    missing_credentials: {
      en: 'email or username is required',
      el: 'απαιτείται email ή username',
    },
    required_password: {
      en: 'password is required',
      el: 'ο κωδικός είναι υποχρεωτικός',
    },
    invalid_credentials: {
      en: 'invalid email/username or password',
      el: 'λάθος email/username ή κωδικός',
    },
    unauthorized: { en: 'unauthorized', el: 'μη εξουσιοδοτημένο' },
    invalid_token: {
      en: 'invalid or expired token',
      el: 'μη έγκυρο ή ληγμένο token',
    },
    forbidden: { en: 'forbidden', el: 'απαγορεύεται η πρόσβαση' },
  },
};

function t(lang = 'en', ns = 'common', key = 'internal_error', vars = {}) {
  const bundle = (MESSAGES[ns] && MESSAGES[ns][key]) || {};
  const msg =
    (lang && bundle[lang]) || bundle.en || MESSAGES.common.internal_error.en;

  // απλή αντικατάσταση {{var}}
  return String(msg).replace(/\{\{(\w+)\}\}/g, function (_m, k) {
    return Object.prototype.hasOwnProperty.call(vars, k)
      ? String(vars[k])
      : '{{' + k + '}}';
  });
}

module.exports = { t };
