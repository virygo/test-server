'use client';

import Link from 'next/link';
import Image from 'next/image';

export type BusinessCardData = {
  id: string | number; // <— επιτρέπει και number
  name: string;
  slug?: string | null;
  coverUrl?: string | null;
  rating?: number | null;
  priceFrom?: number | null;
  tags?: string[] | null;
};

export default function BusinessCard({ b }: { b: BusinessCardData }) {
  const href = `/business/${String(b.id)}`; // <— ασφαλές cast σε string για το URL

  return (
    <Link href={href} className="block group">
      <article className="rounded-xl overflow-hidden border border-gray-200 bg-white transition shadow-sm hover:shadow-lg hover:-translate-y-0.5">
        {/* Image 3:2 */}
        <div className="relative w-full" style={{ aspectRatio: '3 / 2' }}>
          {b.coverUrl ? (
            <Image
              src={b.coverUrl}
              alt={b.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100" />
          )}
        </div>

        <div className="p-3">
          <div className="font-semibold">{b.name}</div>
          {b.slug && <div className="text-xs text-gray-500">{b.slug}</div>}
        </div>
      </article>
    </Link>
  );
}
