'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function FoodFilters({ onApply }: Props) {
  const [cuisine, setCuisine] = React.useState('');
  const [openNow, setOpenNow] = React.useState(false);
  const [price, setPrice] = React.useState(''); // $, $$, $$$
  const [rating, setRating] = React.useState('');

  function apply() {
    const p = new URLSearchParams();
    if (cuisine) p.set('cuisine', cuisine);
    if (openNow) p.set('openNow', '1');
    if (price) p.set('price', price);
    if (rating) p.set('rating', rating);
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Cuisine</span>
          <input
            className="h-9 rounded border px-2"
            placeholder="e.g. Greek, Italian"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Price</span>
          <select
            className="h-9 rounded border px-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          >
            <option value="">Any</option>
            <option>$</option>
            <option>$$</option>
            <option>$$$</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Min rating</span>
          <select
            className="h-9 rounded border px-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Any</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={openNow}
            onChange={(e) => setOpenNow(e.target.checked)}
          />
          Open now
        </label>
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
