// src/routes/categories.js
const express = require('express');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middlewares/asyncHandler');
const { authRequired, requireRole } = require('../middlewares/auth');
const { t } = require('../i18n/messages');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// GET /api/categories  (public)
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });
    res.json(categories);
  })
);
router.get(
  '/full',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' }, // Category ΕΧΕΙ order
      select: {
        id: true,
        slug: true,
        name: true,
        order: true,
        createdAt: true,
        updatedAt: true,

        // ----- Category-level filters -----
        filters: {
          orderBy: { key: 'asc' }, // ΔΕΝ βάζουμε order εδώ, το Filter δεν έχει order column
          select: {
            id: true,
            key: true,
            label: true,
            type: true,
            // order: true,   <-- ΒΓΑΛΤΟ
            options: {
              orderBy: { label: 'asc' }, // FilterOption ταξινόμηση με label
              select: { id: true, label: true, value: true }, // order: true <-- ΒΓΑΛΤΟ
            },
          },
        },

        // ----- Subcategories -----
        subcategories: {
          orderBy: { order: 'asc' }, // Subcategory ΕΧΕΙ order
          select: {
            id: true,
            slug: true,
            name: true,
            order: true,
            bookingMode: true,
            createdAt: true,
            updatedAt: true,

            // ----- Subcategory-level filters -----
            filters: {
              orderBy: { key: 'asc' }, // πάλι, ΟΧΙ order εδώ
              select: {
                id: true,
                key: true,
                label: true,
                type: true,
                // order: true,  <-- ΒΓΑΛΤΟ
                options: {
                  orderBy: { label: 'asc' },
                  select: { id: true, label: true, value: true }, // order: true <-- ΒΓΑΛΤΟ
                },
              },
            },
          },
        },
      },
    });

    res.json(categories);
  })
);

// POST /api/categories  (admin only)
router.post(
  '/',
  authRequired,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { name } = req.body || {};

    // απλός έλεγχος ονόματος
    if (!name || typeof name !== 'string' || !name.trim()) {
      const err = new Error('name is required');
      err.status = 400;
      err.ns = 'users'; // ξαναχρησιμοποιούμε τα μηνύματα του users
      err.key = 'required_name'; // θα γυρίσει τα i18n που ήδη έχεις
      throw err;
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });

    res.status(201).json(category);
  })
);
// PUT /api/categories/:id  (ADMIN only)
router.put(
  '/:id',
  authRequired,
  isAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: 'invalid_id' });

    const { name } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      const err = new Error('name is required');
      err.status = 400;
      throw err;
    }

    try {
      const updated = await prisma.category.update({
        where: { id },
        data: { name: name.trim() },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      });
      res.json(updated);
    } catch (err) {
      // Αν δεν υπάρχει το id
      if (err.code === 'P2025')
        return res.status(404).json({ error: 'not_found' });
      throw err;
    }
  })
);

// DELETE /api/categories/:id  (ADMIN only)
router.delete(
  '/:id',
  authRequired,
  isAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: 'invalid_id' });

    try {
      await prisma.category.delete({ where: { id } });
      res.status(204).end(); // 204 No Content
    } catch (err) {
      if (err.code === 'P2025')
        return res.status(404).json({ error: 'not_found' });
      throw err;
    }
  })
);

module.exports = router;
