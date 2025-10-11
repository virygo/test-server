// frontend/src/app/page.tsx
'use client';

import Link from 'next/link';
import type { IconType } from 'react-icons';
import Carousel from '../components/Carousel';

// Font Awesome (react-icons/fa6)
import {
  FaBed,
  FaUmbrellaBeach,
  FaPlane,
  FaShip,
  FaCar,
  FaHelicopter,
  FaUtensils,
  FaChampagneGlasses,
  FaSpa,
  FaMountain,
  FaLandmark,
} from 'react-icons/fa6';
import { LuArmchair } from 'react-icons/lu';

type CarouselItem = {
  id: number;
  title: string;
  subtitle: string;
};

type Category = {
  key: string;
  label: string;
  subtitle: string;
  href: string;
  icons: IconType[];
};

const categories: Category[] = [
  {
    key: 'stay',
    label: 'Stay',
    subtitle: 'Καταλύματα',
    href: '/stay',
    icons: [FaBed, LuArmchair],
  },
  {
    key: 'e_tickets',
    label: 'E-Tickets',
    subtitle: 'Αεροπορικά & Πλοία',
    href: '/e-tickets',
    icons: [FaPlane, FaShip],
  },
  {
    key: 'food',
    label: 'Food',
    subtitle: 'Φαγητό',
    href: '/food',
    icons: [FaUtensils],
  },
  {
    key: 'nightlife',
    label: 'Nightlife',
    subtitle: 'Νυχτερινή ζωή',
    href: '/nightlife',
    icons: [FaChampagneGlasses],
  },
  {
    key: ' beach_club',
    label: 'Beach Club',
    subtitle: 'Παραλία & Beach Bars',
    href: '/beach-club',
    icons: [FaUmbrellaBeach],
  },
  {
    key: 'transport',
    label: 'Transport',
    subtitle: 'Μεταφορές',
    href: '/transport',
    icons: [FaCar],
  },
  {
    key: 'rentals',
    label: 'Rentals',
    subtitle: 'Ενοικιάσεις',
    href: '/rentals',
    icons: [FaCar, FaHelicopter, FaShip],
  },
  {
    key: 'wellness',
    label: 'Wellness',
    subtitle: 'Spa & χαλάρωση',
    href: '/wellness',
    icons: [FaSpa],
  },
  {
    key: 'activities',
    label: 'Activities',
    subtitle: 'Δραστηριότητες',
    href: '/activities',
    icons: [FaMountain],
  },
  {
    key: 'culture',
    label: 'Culture',
    subtitle: 'Πολιτισμός',
    href: '/culture',
    icons: [FaLandmark],
  },
];

/* -------- Dummy δεδομένα (μέχρι να τα δώσουμε από API) -------- */
const hotels: CarouselItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `Hotel ${i + 1}`,
  subtitle: 'Mykonos',
}));

const bars: CarouselItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `Bar/Club ${i + 1}`,
  subtitle: 'Nightlife',
}));

const restaurants: CarouselItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `Restaurant ${i + 1}`,
  subtitle: 'Food',
}));

//  Offers: τώρα 4 items (ήταν 3)
const offersA: CarouselItem[] = [
  { id: 1, title: 'Stay −15%', subtitle: '3 nights' },
  { id: 2, title: 'Car −10%', subtitle: 'week deal' },
  { id: 3, title: 'Spa 2x1', subtitle: 'weekend' },
  { id: 4, title: 'Dinner set −20%', subtitle: 'fixed menu' },
];

const offersB: CarouselItem[] = [
  { id: 5, title: 'Beach Club pass', subtitle: 'Mon↔Thu' },
  { id: 6, title: 'Late dinner set', subtitle: 'fixed menu' },
  { id: 7, title: 'Sunset cruise', subtitle: 'Fri special' },
  { id: 8, title: 'Party table −15%', subtitle: 'this week' },
];

const parties: CarouselItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `Party ${i + 1}`,
  subtitle: 'This week',
}));

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 w-full overflow-x-hidden">
      {/* --- Grid 5x2 (desktop), 2 cols σε μικρές οθόνες --- */}
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5 place-items-center mt-6">
          {categories.map((c) => {
            return (
              <Link
                key={c.key}
                href={c.href}
                className="w-full h-24 md:h-28 rounded-xl border border-gray-300 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition flex flex-col items-center justify-center gap-2"
                aria-label={c.label}
              >
                {/* Icons πάνω-πάνω, 1–3 ανά κάρτα */}
                <div className="flex items-center gap-2">
                  {c.icons.map((Icon, i) => (
                    <Icon
                      key={i}
                      className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
                    />
                  ))}
                </div>

                {/* Label */}
                <span className="text-[13px] md:text-sm font-semibold">
                  {c.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* --- Offers πάνω από τα Top-10 --- */}
        {/* mobile: καρουζέλ, desktop: 4 σταθερά (το Carousel σου ήδη το χειρίζεται με props/responsive) */}
        <section className="space-y-2 mt-8 -mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Offers</h2>
          <Carousel items={offersA} />
        </section>

        {/* --- Top 10 Hotels --- */}
        <section className="space-y-2 mt-8 -mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Top 10 Hotels</h2>
          <Carousel items={hotels} />
        </section>

        {/* --- Top 10 Bars --- */}
        <section className="space-y-2 mt-8 -mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Top 10 Bars</h2>
          <Carousel items={bars} />
        </section>

        {/* --- Top 10 Restaurants --- */}
        <section className="space-y-2 mt-8 -mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Top 10 Restaurants</h2>
          <Carousel items={restaurants} />
        </section>

        {/* --- Offers ανάμεσα --- */}
        <section className="space-y-2 mt-8 -mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">More Offers</h2>
          <Carousel items={offersB} />
        </section>

        {/* --- Parties --- */}
        <section className="space-y-2 mt-8 -mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="text-lg font-semibold">Parties</h2>
          <Carousel items={parties} />
        </section>

        {/* --- Τελική προτροπή για εγγραφή --- */}
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-blue-900 mt-10">
          <h3 className="text-xl font-bold mb-1">Join VIRYGO</h3>
          <p className="text-sm opacity-90 mb-3">
            Save favorites, unlock member discounts, and get alerts for new
            parties & deals.
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
