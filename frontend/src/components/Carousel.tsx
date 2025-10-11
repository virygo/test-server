'use client';

export type CarouselItem = {
  id: number | string;
  title: string;
  subtitle?: string;
  image?: string;
  href?: string;
  ctaLabel?: string;
};

type Props = {
  items: CarouselItem[];
  /** 'offers' = 4 σταθερές σε desktop (mobile: καρουζέλ ~2.5). 'scroll' = καρουζέλ παντού. */
  variant?: 'offers' | 'scroll';
};

/* -------------------- Κοινό card -------------------- */
function CardBase({
  it,
  showCTA,
  overlayOnHover,
}: {
  it: CarouselItem;
  showCTA: boolean;
  overlayOnHover?: boolean;
}) {
  const img = it.image ?? '/placeholder.jpg';
  return (
    <a
      href={it.href ?? '#'}
      className="group block rounded-xl border border-gray-200 bg-white/90 overflow-hidden relative"
    >
      {/* Εικόνα */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={it.title}
        className="w-full aspect-[4/3] object-cover"
      />

      {/* Κείμενα */}
      <div className="p-3">
        <div className="text-sm font-semibold">{it.title}</div>
        {it.subtitle && (
          <div className="text-xs text-gray-600 mt-1">{it.subtitle}</div>
        )}
      </div>

      {/* CTA (για Top10/Parties) */}
      {showCTA && (
        <div className="px-3 pb-3">
          <span className="inline-flex h-8 items-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 transition">
            {it.ctaLabel ?? 'Reserve Now'}
          </span>
        </div>
      )}

      {/* Overlay (για Offers) */}
      {overlayOnHover && (
        <div className="pointer-events-none absolute inset-0 bg-black/45 opacity-0 transition group-hover:opacity-100 group-focus:opacity-100">
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            <span className="pointer-events-auto rounded-md bg-white/95 px-3 py-1 text-sm font-semibold text-blue-700 shadow">
              {it.ctaLabel ?? 'View Offer'}
            </span>
          </div>
        </div>
      )}
    </a>
  );
}

/* -------------------- Βοήθεια για 4 offers -------------------- */
function ensureFour(items: CarouselItem[]): CarouselItem[] {
  const out = items.slice(0, 4);
  while (out.length < 4) {
    out.push({
      id: `placeholder-${out.length + 1}`,
      title: '—',
      subtitle: '—',
      href: '#',
    });
  }
  return out;
}

/* -------------------- Κύριο Component -------------------- */
export default function Carousel({ items, variant = 'scroll' }: Props) {
  if (variant === 'offers') {
    //  OFFERS:
    // mobile: οριζόντιο καρουζέλ ~2.5 κάρτες
    // desktop: ΠΑΝΤΑ 4 σταθερές κάρτες
    const four = ensureFour(items);

    return (
      <div className="w-full">
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="grid grid-flow-col auto-cols-[40%] gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2">
            {items.map((it) => (
              <div key={it.id} className="snap-start">
                <CardBase it={it} showCTA={false} overlayOnHover />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 4 σταθερές (χωρίς scroll) */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4">
          {four.map((it) => (
            <CardBase key={it.id} it={it} showCTA={false} overlayOnHover />
          ))}
        </div>
      </div>
    );
  }

  //  TOP10 / PARTIES / κ.λπ.: καρουζέλ σε mobile + desktop
  return (
    <div className="w-full">
      <div className="grid grid-flow-col auto-cols-[75%] sm:auto-cols-[50%] md:auto-cols-[33.333%] lg:auto-cols-[25%] gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2">
        {items.map((it) => (
          <div key={it.id} className="snap-start">
            <CardBase it={it} showCTA={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
