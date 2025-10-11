const express = require('express');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middlewares/asyncHandler');
const { validateUserCreate } = require('../validators/userValidators');
const bcrypt = require('bcrypt');

const router = express.Router();

// GET /api/users
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        createdAt: true,
        role: true,
      },
    });
    res.json(users);
  })
);

// POST /api/users
router.post(
  '/',
  validateUserCreate, // πρώτα validation
  asyncHandler(async (req, res) => {
    const { email, name, username, password, role } = req.body || {};

    // hash password πριν την αποθήκευση
    const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
    const hashedPassword = await bcrypt.hash(password, rounds);

    const user = await prisma.user.create({
      data: { email, name, username, password: hashedPassword, role },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  })
);

module.exports = router;
