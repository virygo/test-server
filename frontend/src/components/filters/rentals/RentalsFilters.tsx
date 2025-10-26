'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function RentalsFilters({ onApply }: Props) {
  const [type, setType] = React.useState(''); // car/scooter/boat/bike
  const [transmission, setTransmission] = React.useState('');
  const [fuel, setFuel] = React.useState('');
  const [priceMax, setPriceMax] = React.useState('');

  function apply() {
    const p = new URLSearchParams();
    if (type) p.set('type', type);
    if (transmission) p.set('trans', transmission);
    if (fuel) p.set('fuel', fuel);
    if (priceMax) p.set('priceMax', priceMax);
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Type</span>
          <select
            className="h-9 rounded border px-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Any</option>
            <option value="car">Car</option>
            <option value="scooter">Scooter</option>
            <option value="boat">Boat</option>
            <option value="bike">Bike</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Transmission</span>
          <select
            className="h-9 rounded border px-2"
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
          >
            <option value="">Any</option>
            <option value="auto">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Fuel</span>
          <select
            className="h-9 rounded border px-2"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
          >
            <option value="">Any</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
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
