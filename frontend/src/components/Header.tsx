// frontend/src/components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// προαιρετικός χάρτης για “ωραία” ονόματα
const REGION_LABELS: Record<string, string> = {
  mykonos: 'Mykonos',
  santorini: 'Santorini',
  phuket: 'Phuket',
  // πρόσθεσε κι άλλα αν χρειάζεται
};

export default function Header() {
  const pathname = usePathname();

  const isDestinations = pathname?.startsWith('/destinations') ?? false;

  // Αν το path είναι π.χ. /mykonos, /phuket, /santorini
  let regionLabel = '';
  const m = pathname?.match(/^\/([a-z-]+)(?:\/|$)/); // πιάνει και /region/xxx
  if (m && !isDestinations) {
    const slug = m[1];
    regionLabel = REGION_LABELS[slug] ?? capitalize(slug);
  }

  return (
    <header className="w-full bg-blue-700 text-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Αριστερά: brand + προαιρετικό region */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-wide">Virygo.com</span>
          {regionLabel && (
            <span className="text-sm opacity-90">{regionLabel}</span>
          )}
        </Link>

        {/* Δεξιά: actions */}
        <div className="flex items-center gap-2">
          {/* “Choose region” μόνο στη /destinations */}
          {isDestinations && (
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent('open-region-picker'))
              }
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-white/10 transition"
            >
              Choose region
            </button>
          )}

          <Link href="/login" className="text-sm px-2 py-1 hover:underline">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium rounded-md px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
