// prisma/seed.cjs
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCategoryIdBySlug(slug) {
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) throw new Error(`Category with slug "${slug}" not found`);
  return cat.id;
}
async function getSubcategoryIdBySlug(slug) {
  if (!slug) return null;
  const sub = await prisma.subcategory.findUnique({ where: { slug } });
  if (!sub) throw new Error(`Subcategory with slug "${slug}" not found`);
  return sub.id;
}

async function getSubcategoryIdBySlugAny(...slugs) {
  for (const s of slugs) {
    const sub = await prisma.subcategory.findUnique({ where: { slug: s } });
    if (sub) return sub.id;
  }
  return null; // επιστρέφει null αν δεν βρεθεί
}
// -------- helpers για εύρεση category/subcategory με fallback --------
async function getCategoryIdBySlugAny(...slugs) {
  for (const s of slugs) {
    const cat = await prisma.category.findUnique({ where: { slug: s } });
    if (cat) return cat.id;
  }
  throw new Error(`Category with slugs [${slugs.join(', ')}] not found`);
}

async function main() {
  // 1) Vendor User (role: VENDOR)
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      username: 'mykonos_vendor',
      name: 'Mykonos Vendor',
      // άφησε το password κενό προς το παρόν (θα μπει auth αργότερα)
      role: 'VENDOR',
    },
  });

  // 2) VendorProfile 1-1 με User (VENDOR)
  await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      companyName: 'Mykonos Experiences LTD',
      taxId: 'EL123456789',
      phone: '‪+30 210 0000000‬',
    },
  });

  // 3) Business (π.χ. Spa) με κατηγορία & (προαιρετικά) υποκατηγορία
  const categoryId = await getCategoryIdBySlugAny(
    'beauty_wellness_fitness',
    'wellness'
  );
  // π.χ. Wellness
  // Αν έχεις υποκατηγορία, βάλε εδώ το slug της, αλλιώς άσ’ το null
  const subcategoryId = await getSubcategoryIdBySlugAny('spa', 'wellness_spa'); // ή null εάν δεν υπάρχει

  const spaBusiness = await prisma.business.upsert({
    where: { slug: 'mykonos-spa' },
    update: {},
    create: {
      ownerId: vendorUser.id,
      name: 'Mykonos Spa',
      slug: 'mykonos-spa',
      description: 'Premium spa services in Mykonos',
      email: 'info@mykonos-spa.com',
      phone: '‪+30 22890 00000‬',
      website: 'https://example.com',
      address1: 'Chora',
      city: 'Mykonos',
      country: 'GR',
      lat: 37.446,
      lng: 25.328,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      bookingMode: 'INSTANT', // ή 'REQUEST_TO_BOOK'
    },
  });

  // 4) Media για το Business (μία demo εικόνα από /public)
  await prisma.media.upsert({
    where: { id: 'media-mykonos-spa-cover' },
    update: {},
    create: {
      id: 'media-mykonos-spa-cover',
      title: 'Cover',
      url: '/hero-mykonos.jpg', // υπάρχει ήδη στο /frontend/public
      order: 0,
      businessId: spaBusiness.id,
    },
  });

  // 5) Services (π.χ. Massage/Facial/Hair)
  const servicesData = [
    {
      name: 'Massage 60’',
      slug: 'massage-60',
      description: 'Relaxing full body massage',
      durationMin: 60,
      price: 90.0,
      currency: 'EUR',
      isActive: true,
    },
    {
      name: 'Facial Treatment',
      slug: 'facial-standard',
      description: 'Deep cleansing facial',
      durationMin: 50,
      price: 70.0,
      currency: 'EUR',
      isActive: true,
    },
    {
      name: 'Haircut & Blow Dry',
      slug: 'haircut-blowdry',
      description: 'Cut & style',
      durationMin: 45,
      price: 50.0,
      currency: 'EUR',
      isActive: true,
    },
  ];
  for (const s of servicesData) {
    await prisma.service.upsert({
      where: {
        business_slug: {
          businessId: spaBusiness.id,
          slug: s.slug,
        },
      },
      update: {
        name: s.name,
        description: s.description ?? null,
        durationMin: s.durationMin,
        price: s.price != null ? new Prisma.Decimal(String(s.price)) : null,
        currency: 'EUR',
        isActive: true,
      },
      create: {
        businessId: spaBusiness.id,
        slug: s.slug,
        name: s.name,
        description: s.description ?? null,
        durationMin: s.durationMin,
        price: s.price != null ? new Prisma.Decimal(String(s.price)) : null,
        currency: 'EUR',
        isActive: true,
      },
    });

    //  Προαιρετικά, ένα media για κάθε service
    await prisma.media.create({
      data: {
        businessId: spaBusiness.id,
        url: '/hero-mykonos.jpg',
        alt: `${s.name} photo`,
        kind: 'COVER',
        order: 0,
      },
    });
  }

  console.log(' Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
