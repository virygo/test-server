'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Προσαρμοσμένα στα relative paths που δείχνουν τα screenshots σου
import DestinationsHeader from '../../components/DestinationsHeader';
import RegionPickerModal from '../../components/RegionPickerModal';
import DestinationCard from '../../components/DestinationCard';
import PromoSignupBanner from '../../components/PromoSignupBanner';

type ApiRegion = {
  id: string;
  slug: string;
  name: string;
  providerMode: 'OWN' | 'PARTNER' | 'HYBRID';
  provider: string | null;
  providerRegionId: string | null;
  featureConfig: Record<string, unknown> | null;
};

type UiDestination = {
  key: string; // ίδιο με slug
  name: string;
  country: string;
  image?: string; // optional; θα κάνουμε fallback
};

// Αν έχεις assets, δήλωσέ τα εδώ — αλλιώς θα πέσει σε placeholder
const IMAGE_BY_SLUG: Record<string, string> = {
  mykonos: '/hero-mykonos.jpg',
  santorini: '/hero-santorini.jpg',
  phuket: '/hero-phuket.jpg',
};

const COUNTRY_BY_SLUG: Record<string, string> = {
  mykonos: 'Greece',
  santorini: 'Greece',
  phuket: 'Thailand',
};

const PLACEHOLDER = '/placeholder.jpg';

export default function DestinationsPage() {
  const router = useRouter();

  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    const open = () => setOpenPicker(true);
    window.addEventListener('open-region-picker', open);
    return () => window.removeEventListener('open-region-picker', open);
  }, []);

  const [regions, setRegions] = useState<ApiRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Αν έκανες το Βήμα 2 (Επιλογή Α), αυτό θα είναι π.χ. 'http://localhost:3000'
    // Αν έβαλες rewrites (Επιλογή Β), τότε ΑΛΛΑΞΕ την επόμενη γραμμή σε: fetch('/api/regions')
    const base = process.env.NEXT_PUBLIC_API_BASE ?? '';
    fetch(`${base}/api/regions`)
      .then((r) => r.json())
      .then((data) => {
        setRegions(
          Array.isArray(data?.regions) ? (data.regions as ApiRegion[]) : []
        );
      })
      .catch(() => setRegions([]))
      .finally(() => setLoading(false));
  }, []);

  // Μετατροπή API → UI (όνομα/χώρα/εικόνα)
  const ALL_DESTINATIONS: UiDestination[] = useMemo(() => {
    return regions.map((r) => ({
      key: r.slug,
      name: r.name,
      country: COUNTRY_BY_SLUG[r.slug] ?? '',
      image: IMAGE_BY_SLUG[r.slug], // αν λείπει, θα γίνει fallback παρακάτω
    }));
  }, [regions]);

  // interleave: κάθε 3 κάρτες → promo
  const items = useMemo(() => {
    const out: Array<{ type: 'card' | 'promo'; idx?: number }> = [];
    for (let i = 0; i < ALL_DESTINATIONS.length; i++) {
      out.push({ type: 'card', idx: i });
      if ((i + 1) % 3 === 0) out.push({ type: 'promo' });
    }
    return out;
  }, [ALL_DESTINATIONS]);
  // ΠΑΝΤΑ string image (με fallback) για να ταιριάζει στον τύπο του RegionPickerModal
  const modalRegions = useMemo(
    () =>
      ALL_DESTINATIONS.map((d) => ({
        key: d.key,
        name: d.name,
        country: d.country,
        image: d.image ?? PLACEHOLDER, // ✅ ποτέ undefined
      })),
    [ALL_DESTINATIONS]
  );

  const selectRegion = (region: string) => {
    document.cookie = `region=${region}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    router.push(`/${region}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={IMAGE_BY_SLUG['mykonos'] ?? PLACEHOLDER}
            alt="Destinations"
            width={1400}
            height={500}
            className="h-52 w-full object-cover md:h-72"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
              Choose your destination
            </h1>
          </div>
        </div>
      </section>

      {/* Grid: κάρτες + promo */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        {loading ? (
          <p>Loading destinations…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((it, i) => {
              if (it.type === 'promo') {
                return <PromoSignupBanner key={`promo-${i}`} />;
              }
              const d = ALL_DESTINATIONS[it.idx!];
              const img = d.image ?? PLACEHOLDER; // ✅ fallback για not-a-valid-image
              return (
                <DestinationCard
                  key={d.key}
                  image={img}
                  title={d.name}
                  subtitle={d.country}
                  onClick={() => selectRegion(d.key)}
                />
              );
            })}
          </div>
        )}
      </section>

      <RegionPickerModal
        open={openPicker}
        onClose={() => setOpenPicker(false)}
        onSelect={(key) => selectRegion(key)}
        regions={modalRegions}
      />
    </div>
  );
}
