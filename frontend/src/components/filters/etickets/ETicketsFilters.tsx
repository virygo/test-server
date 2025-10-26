'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function ETicketsFilters({ onApply }: Props) {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [type, setType] = React.useState('');

  function apply() {
    const p = new URLSearchParams();
    if (from) p.set('from', from);
    if (to) p.set('to', to);
    if (type) p.set('type', type);
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">From</span>
          <input
            type="date"
            className="h-9 rounded border px-2"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">To</span>
          <input
            type="date"
            className="h-9 rounded border px-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Type</span>
          <select
            className="h-9 rounded border px-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Any</option>
            <option value="concert">Concert</option>
            <option value="museum">Museum</option>
            <option value="tour">Tour</option>
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
