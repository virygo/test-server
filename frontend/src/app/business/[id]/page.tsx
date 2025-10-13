'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Business = {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  rating?: number;
  tags?: string[];
  priceFrom?: number;
  address?: string;
  phone?: string;
};

export default function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch(`http://localhost:3000/api/businesses/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setBusiness(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p>Business not found.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-2">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-gray-900">
      <Link
        href="/"
        className="inline-block mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </Link>

      {business.coverUrl ? (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg mb-6">
          <Image
            src={business.coverUrl}
            alt={business.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center text-gray-400">
          No image
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
      {business.rating && (
        <p className="text-yellow-600 font-medium mb-2">
          ★ {business.rating.toFixed(1)} / 5
        </p>
      )}
      {business.address && (
        <p className="text-gray-700 mb-2">📍 {business.address}</p>
      )}
      {business.phone && (
        <p className="text-gray-700 mb-4">📞 {business.phone}</p>
      )}

      {business.description && (
        <p className="text-gray-800 leading-relaxed mb-6">
          {business.description}
        </p>
      )}

      {business.tags && business.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {business.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {business.priceFrom && (
        <p className="text-lg font-semibold text-green-700 mb-4">
          From €{business.priceFrom}
        </p>
      )}

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h2 className="text-xl font-semibold mb-3">Services</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </main>
  );
}
