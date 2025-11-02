import Link from 'next/link';
import Image from 'next/image';

export type BusinessCardData = {
  id: string | number;
  name: string;
  slug: string;
  region?: string | null;
  coverUrl?: string | null;
  rating?: number | null;
  priceFrom?: number | null;
};

export default function BusinessCard({ b }: { b: BusinessCardData }) {
  // ✅ πολύ σημαντικό: link με το region
  const href = b.region
    ? `/${b.region}/business/${b.slug}`
    : `/business/${b.slug}`;

  return (
    <Link
      href={href}
      className="block rounded overflow-hidden shadow hover:shadow-lg transition"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {b.coverUrl ? (
          <Image
            src={b.coverUrl}
            alt={b.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </div>

      <div className="p-3">
        <div className="font-semibold text-gray-800">{b.name}</div>
        {b.priceFrom && (
          <div className="text-sm text-gray-500">From €{b.priceFrom}</div>
        )}
      </div>
    </Link>
  );
}
