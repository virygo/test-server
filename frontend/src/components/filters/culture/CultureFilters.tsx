'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function CultureFilters({ onApply }: Props) {
  const [kind, setKind] = React.useState(''); // museum/gallery/landmark
  const [ticketed, setTicketed] = React.useState('');
  const [guided, setGuided] = React.useState('');

  function apply() {
    const p = new URLSearchParams();
    if (kind) p.set('kind', kind);
    if (ticketed) p.set('ticketed', ticketed);
    if (guided) p.set('guided', guided);
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Type</span>
          <select
            className="h-9 rounded border px-2"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">Any</option>
            <option value="museum">Museum</option>
            <option value="gallery">Gallery</option>
            <option value="landmark">Landmark</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Ticket</span>
          <select
            className="h-9 rounded border px-2"
            value={ticketed}
            onChange={(e) => setTicketed(e.target.value)}
          >
            <option value="">Any</option>
            <option value="yes">Ticketed</option>
            <option value="no">Free</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Guided</span>
          <select
            className="h-9 rounded border px-2"
            value={guided}
            onChange={(e) => setGuided(e.target.value)}
          >
            <option value="">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="ml-auto">
          <button
            onClick={apply}
            className="h-10 px-5 rounded-md bg-blue-600 text-white font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
