'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function BwfFilters({ onApply }: Props) {
  // Χρησιμοποιείς τα subcats που έχεις ήδη (hair_nails, spa_massage, ...)
  const [service, setService] = React.useState('');
  const [duration, setDuration] = React.useState(''); // σε λεπτά
  const [priceMax, setPriceMax] = React.useState('');

  function apply() {
    const p = new URLSearchParams();
    if (service) p.set('service', service);
    if (duration) p.set('duration', duration);
    if (priceMax) p.set('priceMax', priceMax);
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Service</span>
          <select
            className="h-9 rounded border px-2"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Any</option>
            <option value="hair_nails">Hair &amp; Nails</option>
            <option value="spa_massage">Spa &amp; Massage</option>
            <option value="face_body_treatments">Face &amp; Body</option>
            <option value="aesthetic_beauty">Aesthetic &amp; Beauty</option>
            <option value="holistic_lifestyle">Holistic &amp; Lifestyle</option>
            <option value="fitness_personal_training">Fitness &amp; PT</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Duration (min)</span>
          <input
            type="number"
            className="h-9 w-24 rounded border px-2"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Max €</span>
          <input
            type="number"
            className="h-9 w-24 rounded border px-2"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
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
