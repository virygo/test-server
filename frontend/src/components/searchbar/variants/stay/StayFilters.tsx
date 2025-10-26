'use client';
import React from 'react';

type Props = { onApply?: (params: URLSearchParams) => void };

export default function StayFilters({ onApply }: Props) {
  const [priceMin, setPriceMin] = React.useState('');
  const [priceMax, setPriceMax] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [amenities, setAmenities] = React.useState<string[]>([]);

  const amenityOptions = [
    'wifi',
    'pool',
    'parking',
    'breakfast',
    'ac',
    'kitchen',
  ];

  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function apply() {
    const p = new URLSearchParams();
    if (priceMin) p.set('priceMin', priceMin);
    if (priceMax) p.set('priceMax', priceMax);
    if (propertyType) p.set('propertyType', propertyType);
    if (amenities.length) p.set('amenities', amenities.join(','));
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Price</span>
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-9 w-24 rounded border px-2"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-9 w-24 rounded border px-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Type</span>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="h-9 rounded border px-2"
          >
            <option value="">Any</option>
            <option value="hotel">Hotel</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="hostel">Hostel</option>
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600">Amenities</span>
          {amenityOptions.map((a) => (
            <label key={a} className="text-sm inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
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
