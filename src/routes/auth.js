// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middlewares/asyncHandler');
const { authRequired } = require('../middlewares/auth');
const { t } = require('../i18n/messages');

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, username, password } = req.body || {};

    // απλό validation εισόδου
    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ error: t(req.lang, 'auth', 'missing_credentials') });
    }

    // βρες user με email ή username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          username ? { username } : undefined,
        ].filter(Boolean),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: t(req.lang, 'auth', 'invalid_credentials') });
    }

    // σύγκριση κωδικού
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(400)
        .json({ error: t(req.lang, 'auth', 'invalid_credentials') });
    }

    // έκδοση JWT
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES || '7d';
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, secret, { expiresIn });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json({ token, user: safeUser });
  })
);

// GET /api/auth/me (προστατευμένο)
router.get(
  '/me',
  authRequired,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);

module.exports = router;
