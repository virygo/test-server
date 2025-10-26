'use client';

import Link from 'next/link';

export default function PromoSignupBanner() {
  return (
    <div className="col-span-full rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-900">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base md:text-lg font-semibold">Join VIRYGO</h3>
          <p className="text-sm opacity-80">
            Save favorites, unlock member discounts, and get alerts for new
            parties &amp; deals.
          </p>
        </div>
        <Link
          href="/signup"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
