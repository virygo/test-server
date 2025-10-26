'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoryFilters from '../../../components/filters/CategoryFilters';
import VirygoDatePicker from '../../../components/VirygoDatePicker';

export default function StaySearchBar() {
  const router = useRouter();
  const qs = useSearchParams();

  // Prefill από query (κρατάμε ό,τι ήδη δουλεύει)
  const [destination, setDestination] = React.useState<string>(
    qs.get('destination') || ''
  );
  const [checkIn, setCheckIn] = React.useState<string>(qs.get('checkIn') || '');
  const [checkOut, setCheckOut] = React.useState<string>(
    qs.get('checkOut') || ''
  );
  const [travelers, setTravelers] = React.useState<number>(
    Number(qs.get('guests') || '2')
  );
  const [rooms, setRooms] = React.useState<number>(
    Number(qs.get('rooms') || '1')
  );

  // Modal state για Filters
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  function submit() {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', String(travelers));
    params.set('rooms', String(rooms));
    router.push(`?${params.toString()}`);
  }

  // Καλείται από το modal όταν πατήσεις Apply
  function handleApplyFilters(filterParams: URLSearchParams) {
    const merged = new URLSearchParams(window.location.search);
    // αντικατάσταση 1-προς-1 των τιμών που έρχονται από το modal
    filterParams.forEach((v, k) => {
      if (v === '' || v == null) merged.delete(k);
      else merged.set(k, v);
    });
    router.push(`?${merged.toString()}`);
    setFiltersOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {/* ---------- Search bar row ---------- */}
        <div
          className="
            grid items-start gap-3
            [grid-template-columns:minmax(220px,1fr)_160px_160px_110px_110px_auto]
            max-md:grid-cols-2 max-md:[grid-template-columns:repeat(2,minmax(0,1fr))]
          "
        >
          {/* Destination */}
          <div className="flex flex-col">
            <input
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-12 w-full rounded-lg border px-3"
              aria-label="Destination"
            />
            <div className="mt-1 text-center text-[11px] leading-none text-gray-500">
              &nbsp;
            </div>
          </div>

          {/* Check-in */}
          <div className="flex flex-col">
            <VirygoDatePicker
              selected={checkIn ? new Date(checkIn) : null}
              onChange={(d: Date | null) =>
                setCheckIn(d ? d.toISOString().slice(0, 10) : '')
              }
              // σημαντικό: δίνουμε κλάσεις στο input για να φαίνεται “κουτάκι”
              className="h-12 w-full rounded-lg border px-3 text-center"
            />
            <div className="mt-1 text-center text-[11px] leading-none text-gray-500">
              Check-in
            </div>
          </div>

          {/* Check-out */}
          <div className="flex flex-col">
            <VirygoDatePicker
              selected={checkOut ? new Date(checkOut) : null}
              onChange={(d: Date | null) =>
                setCheckOut(d ? d.toISOString().slice(0, 10) : '')
              }
              className="h-12 w-full rounded-lg border px-3 text-center"
            />
            <div className="mt-1 text-center text-[11px] leading-none text-gray-500">
              Check-out
            </div>
          </div>

          {/* Travelers */}
          <div className="flex flex-col">
            <input
              type="number"
              min={1}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="h-12 w-full rounded-lg border px-3 text-center"
              aria-label="Travelers"
            />
            <div className="mt-1 text-center text-[11px] leading-none text-gray-500">
              Travelers
            </div>
          </div>

          {/* Rooms */}
          <div className="flex flex-col">
            <input
              type="number"
              min={1}
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="h-12 w-full rounded-lg border px-3 text-center"
              aria-label="Rooms"
            />
            <div className="mt-1 text-center text-[11px] leading-none text-gray-500">
              Rooms
            </div>
          </div>

          {/* Search button – πάντα δεξιά */}
          <div className="self-start justify-self-end">
            <button
              type="submit"
              className="h-12 rounded-lg px-6 font-semibold bg-blue-600 text-white"
            >
              Search
            </button>
          </div>
        </div>

        {/* ΜΟΝΟ το κουμπί Filters κάτω από τη μπάρα */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="rounded-md border px-4 py-2 font-medium"
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
          >
            Filters
          </button>
        </div>
      </form>

      {/* -------- Modal φίλτρων (μόνο όταν πατήσεις Filters) -------- */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          {/* panel */}
          <div className="relative mx-auto mt-24 w-[min(720px,92vw)] rounded-xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="rounded-md border px-3 py-1"
                aria-label="Close filters"
              >
                Close
              </button>
            </div>

            {/* ΕΔΩ φορτώνουμε τα φίλτρα της κατηγορίας "stay" */}
            <CategoryFilters
              slug="stay"
              onApply={(p) => handleApplyFilters(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
