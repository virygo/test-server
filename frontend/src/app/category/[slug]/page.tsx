'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import BusinessCard from '../../../components/BusinessCard';
import DateTimeBar, {
  type DateTimeValue,
} from '../../../components/DateTimeBar';

type Business = {
  id: string | number;
  name: string;
  slug: string;
  coverUrl?: string | null;
  rating?: number | null;
  priceFrom?: number | null;
  tags?: string[] | null;
};

/* ----------------------- Locale helpers ----------------------- */
type Locale = 'en' | 'el';

function getCookie(name: string) {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}
const getLocale = (): Locale => (getCookie('locale') === 'el' ? 'el' : 'en');

const T = {
  en: {
    date: 'Date',
    time: 'Time',
    subcats: 'Subcategories',
    filters: 'Filters',
    pickSubcat: 'Choose a subcategory',
    noItems: 'No businesses for this category.',
    close: 'Close',
    heading: (slug: string) =>
      slug === 'beauty-wellness-fitness'
        ? 'Beauty · Wellness · Fitness'
        : slug.replace(/-/g, ' · ').replace(/\b\w/g, (s) => s.toUpperCase()),
  },
  el: {
    date: 'Ημερομηνία',
    time: 'Ώρα',
    subcats: 'Υποκατηγορίες',
    filters: 'Φίλτρα',
    pickSubcat: 'Επιλογή υποκατηγορίας',
    noItems: 'Δεν υπάρχουν επιχειρήσεις για αυτή την κατηγορία.',
    close: 'Κλείσιμο',
    heading: (slug: string) =>
      slug === 'beauty-wellness-fitness'
        ? 'Beauty · Wellness · Fitness'
        : slug.replace(/-/g, ' · '),
  },
};

/* ----------------- Υποκατηγορίες για B/W/F ----------------- */
type Subcat = { id: string; slug: string; name: string };

const SUBCATS_BY_CATEGORY: Record<string, Subcat[]> = {
  'beauty-wellness-fitness': [
    { id: '1', slug: 'hair_nails', name: 'Hair & Nails' },
    { id: '2', slug: 'spa_massage', name: 'Spa & Massage' },
    { id: '3', slug: 'face_body_treatments', name: 'Face & Body Treatments' },
    { id: '4', slug: 'aesthetic_beauty', name: 'Aesthetic & Beauty' },
    { id: '5', slug: 'holistic_lifestyle', name: 'Holistic & Lifestyle' },
    {
      id: '6',
      slug: 'fitness_personal_training',
      name: 'Fitness & Personal Training',
    },
  ],
};

/* -------------------- Component -------------------- */

const PAGE_SIZE = 20;

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const [locale, setLocale] = useState<Locale>('en');

  const [dt, setDt] = useState<DateTimeValue>({ date: null, time: null });
  const [showSubcats, setShowSubcats] = useState(false);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const [items, setItems] = useState<Business[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setLocale(getLocale()), []);

  /* ----- Υποκατηγορίες τρέχουσας κατηγορίας ----- */
  const subcats = useMemo<Subcat[]>(
    () => SUBCATS_BY_CATEGORY[slug] ?? [],
    [slug]
  );

  /* ----- Φτιάχνουμε query string για /api/businesses/search ----- */
  const queryStr = useMemo(() => {
    const p = new URLSearchParams();
    p.set('category', slug);
    p.set('limit', String(PAGE_SIZE));
    if (selectedSub) p.set('subs', selectedSub);
    if (dt.date) p.set('date', dt.date);
    if (dt.time) p.set('time', dt.time);
    if (nextCursor) p.set('cursor', nextCursor);
    return p.toString();
  }, [slug, selectedSub, dt, nextCursor]);

  /* ---------------- Fetch (paging) ---------------- */
  const fetchPage = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/businesses/search?${queryStr}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        setItems((prev) => (reset ? json.items : [...prev, ...json.items]));
        setNextCursor(json.nextCursor ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [queryStr]
  );

  /* -- refetch όταν αλλάζει κάτι (ημερομηνία/ώρα/υποκατηγορία/slug) -- */
  useEffect(() => {
    setNextCursor(null);
    setItems([]);
    fetchPage(true);
  }, [slug, dt, selectedSub, fetchPage]);

  /* ---------------- Infinite scroll ---------------- */
  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && nextCursor) {
        fetchPage(false);
      }
    });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [nextCursor, loading, fetchPage]);

  /* --------------- Handlers --------------- */
  function handleSubcategorySelect(scSlug: string) {
    setShowSubcats(false);
    setSelectedSub(scSlug);
  }

  /* ------------------- Render ------------------- */
  const t = T[locale];

  return (
    <div>
      {/* 1) Date & Time */}
      <div style={{ padding: 12 }}>
        <DateTimeBar value={dt} onChange={setDt} />
      </div>

      {/* 2) Κουμπιά Subcategories / Filters */}
      <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
        <button
          onClick={() => setShowSubcats(true)}
          className="rounded-md border px-4 py-2 font-medium"
          aria-haspopup="dialog"
          aria-expanded={showSubcats}
        >
          {t.subcats}
          {selectedSub
            ? `: ${subcats.find((s) => s.slug === selectedSub)?.name ?? ''}`
            : ''}
        </button>

        <button
          onClick={() => alert('Filters coming soon')}
          className="rounded-md border px-4 py-2 font-medium"
          aria-haspopup="dialog"
        >
          {t.filters}
        </button>
      </div>

      {/* Panel Υποκατηγοριών */}
      {showSubcats && (
        <div className="absolute top-20 left-0 right-0 mx-auto w-[90%] max-w-md bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{t.pickSubcat}</h3>
            <button onClick={() => setShowSubcats(false)} className="text-sm">
              {t.close} ✕
            </button>
          </div>

          <ul className="space-y-2">
            {subcats.map((sub) => (
              <li key={sub.id}>
                <button
                  className="w-full text-left hover:bg-gray-100 px-3 py-2 rounded-md"
                  onClick={() => handleSubcategorySelect(sub.slug)}
                >
                  {sub.name}
                </button>
              </li>
            ))}
            {/* “Καμία υποκατηγορία” */}
            <li>
              <button
                className="w-full text-left hover:bg-gray-100 px-3 py-2 rounded-md"
                onClick={() => handleSubcategorySelect('')}
              >
                {locale === 'el' ? 'Χωρίς υποκατηγορία' : 'No subcategory'}
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Τίτλος */}
      <h1 className="text-xl md:text-2xl font-bold mb-4 px-3">
        {t.heading(slug)}
      </h1>

      {/* 3) Λίστα επιχειρήσεων */}
      <main style={{ padding: 12 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {items.length === 0 && !loading && (
            <p style={{ padding: 16, textAlign: 'center', color: '#666' }}>
              {t.noItems}
            </p>
          )}

          {items.length > 0 &&
            items.map((b) => (
              <article key={b.id}>
                <BusinessCard b={b} />
              </article>
            ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div style={{ padding: 16, textAlign: 'center' }}>Loading...</div>
        )}

        {/* Sentinel για infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </main>
    </div>
  );
}
