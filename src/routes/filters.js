// src/routes/filters.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/filters?category=<category-slug>
 * Επιστρέφει ΟΛΑ τα φίλτρα της συγκεκριμένης Γενικής Κατηγορίας:
 * - φίλτρα που είναι σε επίπεδο κατηγορίας (categoryId)
 * - φίλτρα από ΟΛΕΣ τις υποκατηγορίες της (subcategoryId in [...])
 * Ενώνει όσα έχουν ίδιο key, και αφαιρεί διπλές options (με ίδιο value).
 */
router.get('/', async (req, res) => {
  try {
    const categorySlug = String(req.query.category || '').trim();
    if (!categorySlug)
      return res.status(400).json({ error: 'category is required' });

    // Βρίσκουμε την κατηγορία
    const cat = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });
    if (!cat) return res.status(404).json({ error: 'Category not found' });

    // Όλες οι υποκατηγορίες της κατηγορίας
    const subs = await prisma.subcategory.findMany({
      where: { categoryId: cat.id },
      select: { id: true },
    });
    const subIds = subs.map((s) => s.id);

    // Φίλτρα κατηγορίας + φίλτρα υποκατηγοριών
    const [catFilters, subFilters] = await Promise.all([
      prisma.filter.findMany({
        where: { categoryId: cat.id },
        include: { options: true },
      }),
      prisma.filter.findMany({
        where: { subcategoryId: { in: subIds } },
        include: { options: true },
      }),
    ]);

    // Ενοποίηση ανά key (χωρίς διπλότυπες options)
    const byKey = new Map();
    const pushFilter = (f) => {
      if (!byKey.has(f.key)) {
        byKey.set(f.key, {
          key: f.key,
          label: f.label,
          type: f.type,
          options: [],
        });
      }
      const entry = byKey.get(f.key);
      const existing = new Map(entry.options.map((o) => [o.value, o]));
      for (const o of f.options || []) {
        if (!existing.has(o.value)) {
          existing.set(o.value, {
            value: o.value,
            label: o.label,
            order: o.order ?? 0,
          });
        }
      }
      entry.options = Array.from(existing.values()).sort(
        (a, b) => a.order - b.order
      );
    };

    [...catFilters, ...subFilters].forEach(pushFilter);

    res.json({
      category: categorySlug,
      filters: Array.from(byKey.values()),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
