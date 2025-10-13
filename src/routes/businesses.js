// src/routes/businesses.js
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma'); // ίδιο path που έχεις ήδη

// GET /api/businesses/search?category=...&subs=spa,gym&limit=20&cursor=...
router.get('/search', async (req, res, next) => {
  try {
    // ---------------- Params ----------------
    let {
      category, // π.χ. "beauty-wellness-fitness" (με παύλες από το FE)
      subs, // "spa,gym" (προαιρετικό)
      limit = '20',
      cursor, // προαιρετικό για paging (id business)
    } = req.query;

    // FE στέλνει με παύλες – στο DB έχεις underscores
    if (typeof category === 'string' && category.length) {
      category = category.replace(/-/g, '_').toLowerCase();
    } else {
      category = undefined;
    }

    // subs σε array (χαμηλωμένα)
    const subsArr =
      typeof subs === 'string' && subs.trim().length
        ? subs
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean)
        : undefined;

    const take = Math.min(parseInt(limit, 10) || 20, 50);

    // ---------------- Where ----------------
    const where = {
      ...(category ? { category: { slug: category } } : {}),
      ...(subsArr && subsArr.length
        ? { subcategories: { some: { slug: { in: subsArr } } } }
        : {}),
    };

    // ---------------- Query ----------------
    const items = await prisma.business.findMany({
      where,
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      select: {
        id: true,
        name: true,
        slug: true,
        // Media relation – αν δεν υπάρχει, δεν σκάει
        media: {
          take: 1,
          where: { kind: 'COVER' },
          select: { url: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // ---------------- Paging ----------------
    let nextCursor = null;
    if (items.length > take) {
      const nextItem = items.pop();
      nextCursor = nextItem.id;
    }

    // ---------------- Response shape ----------------
    res.json({
      items: items.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        coverUrl: b.media?.[0]?.url ?? null,
      })),
      nextCursor,
    });
  } catch (err) {
    console.error('[/api/businesses/search] ERROR:', err);
    res.status(500).json({ error: 'Internal Server Error' });
    // ή next(err) αν προτιμάς το global error handler
  }
});

module.exports = router;
