// src/routes/regions.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        providerMode: true,
        provider: true,
        providerRegionId: true,
        featureConfig: true,
      },
    });
    res.json({ regions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
