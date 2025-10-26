'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'next/navigation';
import BusinessCard from '../../../components/BusinessCard';
import { verticalFromSlug } from '../../../lib/vertical';

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
const getLocale = (): Locale => 'en';

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
  const v = verticalFromSlug(slug);

  const [locale, setLocale] = useState<Locale>('en');

  const [showSubcats, setShowSubcats] = useState(false);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const [items, setItems] = useState<Business[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => setLocale(getLocale()), []);

  /* ----- Υποκατηγορίες τρέχουσας κατηγορίας ----- */
  const subcats = useMemo<Subcat[]>(
    () => SUBCATS_BY_CATEGORY[slug] ?? [],
    [slug]
  );

  /* ---------------- Query string (σερβίρει τα params) ---------------- */
  const queryStr = useMemo(() => {
    const p = new URLSearchParams();
    p.set('category', slug);
    p.set('limit', String(PAGE_SIZE));
    if (selectedSub) p.set('subs', selectedSub);
    if (nextCursor) p.set('cursor', nextCursor);
    return p.toString();
    // ΜΗΝ βάλεις dangling κόμμα/αγκύλη εδώ
  }, [slug, selectedSub, nextCursor]);

  /* ---------------- Fetch (paging) ---------------- */
  const fetchPage = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);

        // χτίζουμε URL με τα τρέχοντα query params
        const base = new URL(`/api/category/${slug}`, window.location.origin);
        const qs = new URLSearchParams(queryStr);

        // όταν δεν είναι reset, κρατάμε τυχόν nextCursor
        if (!reset && nextCursor) qs.set('cursor', nextCursor);

        base.search = qs.toString();

        const res = await fetch(base.toString());
        const data = await res.json().catch(() => ({}));

        const incoming: Business[] = Array.isArray(data?.items)
          ? data.items
          : [];
        setItems((prev) => (reset ? incoming : [...prev, ...incoming]));
        setNextCursor(data?.nextCursor ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [slug, queryStr, nextCursor]
  );

  /* -- refetch όταν αλλάξει κάτι (ημ/νία/ώρα/υποκατηγορία/slug) -- */
  useEffect(() => {
    setNextCursor(null);
    setItems([]);
    fetchPage(true);
  }, [fetchPage]);

  /* ---------------- Infinite scroll ---------------- */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextCursor) {
          fetchPage(false);
        }
      },
      { rootMargin: '600px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loading, nextCursor, fetchPage]);

  /* --------------- Handlers --------------- */
  function handleSubcategorySelect(scSlug: string) {
    setShowSubcats(false);
    setSelectedSub(scSlug);
  }
  // 🟢 ΕΔΩ ΒΑΖΕΙΣ ΑΥΤΟ:
  const t = T[locale];

  /* ---------------- Render ---------------- */
  return (
    <>
      {/* 2) Buttons row */}
      <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
        {/* Μην δείχνεις Subcategories στο STAY */}
        {v !== 'stays' && (
          <button
            onClick={() => setShowSubcats(true)}
            className="rounded-md border px-4 py-2 font-medium"
            aria-haspopup="dialog"
            aria-expanded={showSubcats}
          >
            {t.subcats}
            {selectedSub
              ? ` : ${subcats.find((s) => s.slug === selectedSub)?.name ?? ''}`
              : ''}
          </button>
        )}

        {/* Κουμπί Filters (ανοίγει modal/placeholder) */}
        <button
        //type="button"
        //onClick={() => alert('Filters coming soon')}
        //className="rounded-md border px-4 py-2 font-medium"
        ></button>
      </div>

      {/* 3) Panel Υποκατηγοριών (δεν εμφανίζεται στο STAY) */}
      {v !== 'stays' && showSubcats && (
        <div className="absolute top-20 left-0 right-0 mx-auto w-[90%] max-w-md bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{t.pickSubcat}</h3>
            <button onClick={() => setShowSubcats(false)} className="text-sm">
              {t.close}
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

            {/* "Καμία υποκατηγορία" */}
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

      {/* 4) Τίτλος */}
      <h1 className="text-xl md:text-2xl font-bold mb-4 px-3">
        {t.heading(slug)}
      </h1>

      {/* 5) Λίστα επιχειρήσεων */}
      <main style={{ padding: 12 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {(items?.length ?? 0) === 0 && !loading && (
            <p style={{ padding: 16, textAlign: 'center', color: '#666' }}>
              {t.noItems}
            </p>
          )}

          {(items ?? []).map((b) => (
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
    </>
  );
}
