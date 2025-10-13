// frontend/src/app/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Carousel, { type CarouselItem } from '../components/Carousel';
import type { IconType } from 'react-icons';

// Font Awesome (react-icons/fa6)
import {
  FaBed,
  FaUmbrellaBeach,
  FaPlane,
  FaShip,
  FaCar,
  FaHelicopter,
  FaUtensils,
  FaChampagneGlasses, // <- ΠΡΟΣΟΧΗ: Glasse*s*
  FaSpa,
  FaMountain,
  FaLandmark,
} from 'react-icons/fa6';

/* ---------------- Types ---------------- */

type Category = {
  key: string;
  label: string;
  /** slug for /category/[slug] */
  slug?: string;
  icons: IconType[];
};

/* ---------------- Locale helpers ---------------- */

type Locale = 'en' | 'el';

function getCookieLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  const m = document.cookie.match(/(?:^|; )locale=(en|el)/);
  return (m?.[1] as Locale) || 'en';
}

// EL subtitles by key (αν είναι el, δείχνουμε αυτά, αλλιώς EN)
const SUBTITLES_EN: Record<string, string> = {
  stay: 'Hotels & Stays',
  e_tickets: 'Flights & Ferries',
  food: 'Food',
  nightlife: 'Nightlife',
  beach_club: 'Beach & Beach Bars',
  transport: 'Transport',
  rentals: 'Rentals',
  wellness: 'Spa & relaxation',
  activities: 'Activities',
  culture: 'Culture',
};

const SUBTITLES_EL: Record<string, string> = {
  stay: 'Καταλύματα',
  e_tickets: 'Αεροπορικά & Πλοία',
  food: 'Φαγητό',
  nightlife: 'Νυχτερινή ζωή',
  beach_club: 'Παραλία & Beach Bars',
  transport: 'Μεταφορές',
  rentals: 'Ενοικιάσεις',
  wellness: 'Spa & χαλάρωση',
  activities: 'Δραστηριότητες',
  culture: 'Πολιτισμός',
};

const L = (locale: Locale, key: string) =>
  locale === 'el'
    ? (SUBTITLES_EL[key] ?? SUBTITLES_EN[key] ?? '')
    : (SUBTITLES_EN[key] ?? '');

/* --------------- Κατηγορίες (Home) --------------- */

const categories: Category[] = [
  { key: 'stay', label: 'Stay', slug: 'stay', icons: [FaBed] },
  {
    key: 'e_tickets',
    label: 'eTickets',
    slug: 'e-tickets',
    icons: [FaPlane, FaShip],
  },
  { key: 'food', label: 'Food', slug: 'food', icons: [FaUtensils] },
  {
    key: 'nightlife',
    label: 'Nightlife',
    slug: 'nightlife',
    icons: [FaChampagneGlasses],
  },
  {
    key: 'beach_club',
    label: 'Beach Club',
    slug: 'beach-club',
    icons: [FaUmbrellaBeach],
  },
  { key: 'transport', label: 'Transport', slug: 'transport', icons: [FaCar] },
  {
    key: 'rentals',
    label: 'Rentals',
    slug: 'rentals',
    icons: [FaCar, FaHelicopter, FaShip],
  },
  // 👇 ΕΔΩ είναι η “Wellness” που ανοίγει το /category/beauty-wellness-fitness
  {
    key: 'wellness',
    label: 'Wellness',
    slug: 'beauty-wellness-fitness',
    icons: [FaSpa],
  },
  {
    key: 'activities',
    label: 'Activities',
    slug: 'activities',
    icons: [FaMountain],
  },
  { key: 'culture', label: 'Culture', slug: 'culture', icons: [FaLandmark] },
];

/* ------ Dummy δεδομένα για carousels (μέχρι να έρθει API) ------ */

const makeDummy = (prefix: string): CarouselItem[] =>
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `${prefix} ${i + 1}`,
    subtitle: 'This week',
  }));

const hotels = makeDummy('Hotel');
const bars = makeDummy('Bar/Club');
const restaurants = makeDummy('Restaurant');

const offersA: CarouselItem[] = [
  { id: 1, title: 'Stay 15%', subtitle: '3 nights' },
  { id: 2, title: 'Car 10%', subtitle: 'week deal' },
  { id: 3, title: 'Spa 2x1', subtitle: 'weekend' },
  { id: 4, title: 'Dinner set 20%', subtitle: 'fixed menu' },
];

const offersB: CarouselItem[] = [
  { id: 5, title: 'Beach Club pass', subtitle: 'Mon-Thu' },
  { id: 6, title: 'Late dinner set', subtitle: 'fixed menu' },
  { id: 7, title: 'Sunset cruise', subtitle: 'Fri special' },
  { id: 8, title: 'Party table 15%', subtitle: 'this week' },
];

const parties = makeDummy('Party');

/* ---------------------- Page ---------------------- */

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');
  useEffect(() => setLocale(getCookieLocale()), []);

  // precomputed subtitles για να μη ξανατρέχουμε σε κάθε render
  const subtitles = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, c) => {
        acc[c.key] = L(locale, c.key);
        return acc;
      }, {}),
    [locale]
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 w-full overflow-x-hidden">
      {/* Grid 5x2 (desktop), 2 cols σε μικρές οθόνες */}
      <main className="mx-auto max-w-6xl px-6 pb-16">
        {/* Grid κατηγοριών */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5 place-items-center mt-6">
          {categories.map((c) => {
            const href = c.slug ? `/category/${c.slug}` : '#';
            return (
              <Link
                key={c.key}
                href={href}
                prefetch={false}
                aria-label={c.label}
                className="w-full h-24 md:h-28 rounded-xl border border-gray-300 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center px-3"
              >
                {/* Icons */}
                <div className="flex items-center gap-2">
                  {c.icons.map((IconComp: IconType, i: number) => (
                    <IconComp
                      key={i}
                      className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
                    />
                  ))}
                </div>

                {/* Label */}
                <span className="block mt-2 text-[13px] md:text-sm font-semibold">
                  {c.label}
                </span>

                {/* Subtitle (EN default, EL αν cookie=el) */}
                <span className="text-[11px] md:text-xs text-gray-500">
                  {subtitles[c.key]}
                </span>
              </Link>
            );
          })}
        </div>

        {/* --- Από εδώ και κάτω τα sections με dummy carousels (όπως πριν) --- */}

        {/* Hotels */}
        <section className="space-y-2 mt-8 mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Top 10 Hotels</h2>
          <Carousel items={hotels} />
        </section>

        {/* Bars */}
        <section className="space-y-2 mt-8 mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Top 10 Bars</h2>
          <Carousel items={bars} />
        </section>

        {/* Restaurants */}
        <section className="space-y-2 mt-8 mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Top 10 Restaurants</h2>
          <Carousel items={restaurants} />
        </section>

        {/* Offers επάνω */}
        <section className="space-y-2 mt-8 mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Offers</h2>
          <Carousel items={offersA} />
        </section>

        {/* Offers ανάμεσα */}
        <section className="space-y-2 mt-8 mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">More Offers</h2>
          <Carousel items={offersB} />
        </section>

        {/* Parties */}
        <section className="space-y-2 mt-8 mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Parties</h2>
          <Carousel items={parties} />
        </section>

        {/* Τελική προτροπή για εγγραφή */}
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-blue-900 mt-10">
          <h3 className="text-xl font-bold mb-3">Join VIRYGO</h3>
          <p className="text-sm opacity-90 mb-3">
            Save favorites, unlock member discounts, and get alerts for new
            parties &amp; deals.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-10 px-4 items-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
          >
            Create an account
          </Link>
        </section>
      </main>
    </div>
  );
}
