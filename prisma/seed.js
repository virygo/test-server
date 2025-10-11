// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// --- helpers ---
const stripEmoji = (s) =>
  (s || '').replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '');

const normalize = (s) =>
  stripEmoji(s)
    .normalize('NFKD') // σπάσιμο τόνων
    .replace(/[\u0300-\u036f]/g, '') // αφαίρεση τόνων
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ') // κρατάμε μόνο a-z0-9 ως λέξεις
    .trim()
    .replace(/\s+/g, ' '); // μονό κενό

const toSlug = (s) => normalize(s).replace(/\s+/g, '_'); // π.χ. "sunset bar" -> "sunset_bar"

const prisma = new PrismaClient();

async function main() {
  // ---- 1) Διαβάζουμε το JSON από το ROOT ----
  const dataPath = path.join(__dirname, '../categories.json'); // <-- root
  const file = fs.readFileSync(dataPath, 'utf-8');
  const json = JSON.parse(file);
  const categories = Array.isArray(json?.categories) ? json.categories : [];

  // ---- 2) Καθαρίζουμε dev data για να ξανασπείρουμε από μηδέν ----
  // (για dev περιβάλλον — αν ΔΕΝ θες delete, πες μου να το κάνουμε με upsert)
  await prisma.filterOption.deleteMany();
  await prisma.filter.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  // ---- 3) Δημιουργία κατηγοριών/υποκατηγοριών/filters ----
  for (let cIdx = 0; cIdx < categories.length; cIdx++) {
    const c = categories[cIdx];
    const catSlug = c.key ? toSlug(c.key) : toSlug(c.name);

    // 3a) Category
    const createdCategory = await prisma.category.create({
      data: {
        slug: catSlug,
        name: c.name, // κρατάμε ορατά emoji στο name
        order: cIdx,
      },
    });

    // 3b) Subcategories (φτιάχνουμε και index map για αντιστοίχιση filters)
    const subMap = new Map(); // normalized name -> { id, name, slug }
    const subcats = Array.isArray(c.subcategories) ? c.subcategories : [];
    for (let sIdx = 0; sIdx < subcats.length; sIdx++) {
      const subName = subcats[sIdx];
      const subSlug = toSlug(subName);
      // booking_mode: μπορεί να έχει αντικείμενο στο JSON (π.χ. Rentals)
      let bookingMode = 'INSTANT';
      if (c.booking_mode && typeof c.booking_mode === 'object') {
        // keys όπως "Boats", "Helicopters" στο JSON — ταιριάζουμε normalised
        for (const [k, v] of Object.entries(c.booking_mode)) {
          if (normalize(k) === normalize(subName)) {
            bookingMode = (v || '').toUpperCase().replace(/-/g, '_'); // request_to_book -> REQUEST_TO_BOOK
            break;
          }
        }
        if (bookingMode === 'INSTANT' && c.booking_mode.default) {
          bookingMode = String(c.booking_mode.default)
            .toUpperCase()
            .replace(/-/g, '_'); // instant_or_request -> INSTANT_OR_REQUEST (αν το έχεις στο enum πες μου)
          // Στο schema σου έχεις BookingMode: INSTANT | REQUEST_TO_BOOK
          // Αν δώσεις "INSTANT_OR_REQUEST" ΔΕΝ υπάρχει. Άρα fallback:
          if (bookingMode !== 'REQUEST_TO_BOOK') bookingMode = 'INSTANT';
        }
      }

      const createdSub = await prisma.subcategory.create({
        data: {
          categoryId: createdCategory.id,
          name: subName,
          slug: subSlug,
          order: sIdx,
          bookingMode,
        },
      });

      subMap.set(normalize(subName), createdSub);
    }

    // 3c) Filters
    // Το JSON έχει 2 σχήματα:
    //  - Κανονικά groups σε category-level (π.χ. "Location", "Amenities" κλπ)
    //  - Groups που είναι ονόματα υποκατηγοριών (π.χ. "Ferries / Boats") -> αυτά πρέπει να πάνε στο αντίστοιχο subcategory
    const groups = c.filters && typeof c.filters === 'object' ? c.filters : {};

    for (const [groupLabel, items] of Object.entries(groups)) {
      const normGroup = normalize(groupLabel);

      // Αν το group όνομα ταιριάζει με κάποια subcategory -> subcategory filter
      const matchedSub = subMap.get(normGroup);

      // default τύπος φίλτρου: MULTISELECT
      const filterType = 'MULTISELECT';
      const filterKey = toSlug(groupLabel).replace(/-/g, '_'); // key χωρίς emojis

      if (matchedSub) {
        // Φίλτρα για το συγκεκριμένο Subcategory
        const createdFilter = await prisma.filter.create({
          data: {
            key: filterKey,
            label: groupLabel, // εμφανιστικό, κρατάμε emoji
            type: filterType,
            subcategoryId: matchedSub.id,
          },
        });

        // Επιλογές φίλτρου
        if (Array.isArray(items)) {
          const optionsData = items.map((label, i) => ({
            filterId: createdFilter.id,
            label,
            value: toSlug(label), // σταθερό value
            order: i,
          }));
          if (optionsData.length) {
            await prisma.filterOption.createMany({ data: optionsData });
          }
        }
      } else {
        // Category-level φίλτρα
        const createdFilter = await prisma.filter.create({
          data: {
            key: filterKey,
            label: groupLabel,
            type: filterType,
            categoryId: createdCategory.id,
          },
        });

        if (Array.isArray(items)) {
          const optionsData = items.map((label, i) => ({
            filterId: createdFilter.id,
            label,
            value: toSlug(label),
            order: i,
          }));
          if (optionsData.length) {
            await prisma.filterOption.createMany({ data: optionsData });
          }
        }
      }
    }
  }

  console.log(' Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(' Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
