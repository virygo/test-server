'use client';
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
  ComponentType,
} from 'react';
import { getSearchbarFor } from '../../../components/searchbar/registry';
import { getFiltersFor } from '../../../components/filters/registry';
import FiltersBar from '../../../components/FiltersBar';
import BusinessCard from '../../../components/BusinessCard';
import { verticalFromSlug } from '../../../lib/vertical';

// Props του κύριου component
type Props = { region: string; slug: string };
type Subcat = { id: string | number; slug: string; name: string };
// ----------------------- BUSINESS TYPE -----------------------
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
    heading: (slug?: string) => {
      if (!slug) return ''; // ✅ Αν δεν έχει slug, γύρνα κενό string
      if (slug === 'beauty-wellness-fitness')
        return 'Beauty · Wellness · Fitness';
      return slug.replace(/-/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
    },
  },
  el: {
    date: 'Ημερομηνία',
    time: 'Ώρα',
    subcats: 'Υποκατηγορίες',
    filters: 'Φίλτρα',
    pickSubcat: 'Επιλογή υποκατηγορίας',
    noItems: 'Δεν υπάρχουν επιχειρήσεις γιά αυτή την κατηγορία.',
    close: 'Κλείσιμο',
    heading: (slug: string) =>
      slug === 'beauty_wellness_fitness'
        ? 'Beauty · Wellness · Fitness'
        : slug.replace(/-/g, ' · '),
  },
};

/* ----------------- Υποκατηγορίες για B/W/F ----------------- */
/** Υποκατηγορίες ανά κατηγορία (placeholder για τώρα) */

const PAGE_SIZE = 20;

export default function CategoryImpl({ region, slug }: Props) {
  // --- Components per category
  const isStays = verticalFromSlug(slug) === 'stays';
  const SearchComp = getSearchbarFor(slug);
  const FiltersComp = useMemo(
    () => getFiltersFor(slug) as ComponentType<{ [key: string]: unknown }>,
    [slug]
  );

  // --- Locale (EN/EL)
  type Locale = 'en' | 'el';
  const [locale, setLocale] = useState<Locale>('en');
  useEffect(
    () =>
      setLocale((document.cookie.includes('lang=el') ? 'el' : 'en') as Locale),
    []
  );

  // --- UI state
  const [subcats, setSubcats] = useState<Subcat[]>([]);
  const [showSubcats, setShowSubcats] = useState(false);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [items, setItems] = useState<Business[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // --- Υποκατηγορίες τρέχουσας κατηγορίας

  // --- Τρέχον query string (category/region/subs/cursor/limit)
  const queryStr = useMemo(() => {
    const p = new URLSearchParams();
    p.set('category', slug);
    p.set('region', region);
    p.set('limit', String(PAGE_SIZE));
    if (selectedSub) p.set('subs', selectedSub);
    if (nextCursor) p.set('cursor', nextCursor);
    return p.toString();
  }, [slug, region, selectedSub, nextCursor]); // σωστά deps

  type ApiResponse = {
    items?: Business[];
    nextCursor?: string | null;
  };

  // --- Fetch (paging)
  const fetchPage = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);

        // Χτίζουμε base URL προς το API ΜΟΝΟ με path
        const base = new URL(`/api/businesses/${slug}`, window.location.origin);

        // Ξαναφτιάχνουμε τα τρέχοντα query params
        const qs = new URLSearchParams(queryStr);

        // Αν ΔΕΝ είναι reset, διατηρούμε τυχόν cursor (για επόμενο page)
        if (!reset && nextCursor) qs.set('cursor', nextCursor);

        base.search = qs.toString();

        const res = await fetch(base.toString());
        const data = (await res.json().catch(() => ({}))) as ApiResponse;

        const incoming: Business[] = Array.isArray(data.items)
          ? data.items
          : [];
        setItems((prev) => (reset ? incoming : [...(prev ?? []), ...incoming]));
        setNextCursor(data.nextCursor ?? null);
        setItems((prev) => (reset ? incoming : [...prev, ...incoming]));
        setNextCursor(data?.nextCursor ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [slug, queryStr, nextCursor] // Μην βάλεις το region εδώ (μπαίνει ήδη στο queryStr)
  );

  // Refetch όταν αλλάξει κάτι (ημ/νία/ώρα/υποκατηγορία/slug)
  useEffect(() => {
    setNextCursor(null);
    setItems([]);
    fetchPage(true);
  }, [fetchPage]);

  // Infinite scroll
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

  useEffect(() => {
    let cancelled = false;

    async function loadSubcategories() {
      try {
        const url = new URL(
          `/api/categories/${slug}/subcategories`,
          window.location.origin
        );
        url.searchParams.set('region', region);

        const res = await fetch(url.toString());
        const data = await res.json().catch(() => []);

        const list: Subcat[] = Array.isArray(data) ? data : (data?.items ?? []);
        if (!cancelled) {
          setSubcats(list ?? []);
          setSelectedSub(null); // reset επιλογής
        }
      } catch (err) {
        if (!cancelled) {
          console.error('loadSubcategories error', err);
          setSubcats([]);
        }
      }
    }

    loadSubcategories();
    return () => {
      cancelled = true;
    };
  }, [slug, region]);

  // Handlers
  function handleSubcategorySelect(scSlug: string) {
    setShowSubcats(false);
    setSelectedSub(scSlug);
  }

  // ---------------- Render ----------------
  return (
    <>
      {/* 1) Search bar */}
      <div className="mt-4">
        <SearchComp region={region} slug={slug} />
      </div>

      {/* 2) Buttons row */}
      <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
        {/* Μην δείχνεις Subcategories στο STAY */}
        {verticalFromSlug(slug) !== 'stays' && (
          <button
            onClick={() => setShowSubcats(true)}
            className="rounded-md border px-4 py-2 font-medium"
            aria-haspopup="dialog"
            aria-expanded={showSubcats}
          >
            {selectedSub
              ? (subcats.find((s) => s.slug === selectedSub)?.name ?? '')
              : 'Subcategories'}
          </button>
        )}

        {/* Κουμπί Filters: ανοίγει το overlay/Modal ΜΟΝΟ (δεν κάνει render φίλτρα στη σελίδα) */}
        {!isStays && (
          <FiltersBar
            triggerClassName="rounded-md border px-4 py-2 font-medium"
            triggerLabel="Filters"
            panelTitle={locale === 'el' ? 'Φίλτρα' : 'Filters'}
          >
            {/* Εδώ ρίχνουμε το σωστό component των φίλτρων */}
            <FiltersComp slug={slug} />
          </FiltersBar>
        )}
      </div>

      {/* 3) Panel υποκατηγοριών (δεν εμφανίζεται στο STAY) */}
      {verticalFromSlug(slug) !== 'stays' && showSubcats && (
        <div className="absolute top-20 left-0 right-0 mx-auto w-[90%] max-w-md bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              {locale === 'el' ? 'Υποκατηγορίες' : 'Subcategories'}
            </h3>
            <button onClick={() => setShowSubcats(false)} className="text-sm">
              ×
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
            {/* Καμία υποκατηγορία */}
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
      <h1 className="text-xl md:text-2xl font-bold mb-4 px-3">{slug}</h1>

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
              {locale === 'el'
                ? 'Δεν υπάρχουν επιχειρήσεις'
                : 'No businesses for this category.'}
            </p>
          )}

          {items?.map((b) => (
            <article key={String(b.id)}>
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
