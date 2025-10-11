// src/middlewares/isAdmin.js
function normalizeRole(role) {
  return String(role || '')
    .trim()
    .toUpperCase();
}

module.exports = function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'unauthenticated' });
  }

  const have = normalizeRole(req.user.role);

  // Προσωρινό log για έλεγχο. Σβήστο όταν σταθεροποιηθεί.
  console.log('[isAdmin] role:', req.user.role, '→', have);

  if (have === 'ADMIN') return next();
  return res.status(403).json({ error: 'forbidden' });
};
