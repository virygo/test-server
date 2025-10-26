'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function TransportFilters({ onApply }: Props) {
  const [mode, setMode] = React.useState(''); // taxi/bus/boat/transfer
  const [time, setTime] = React.useState(''); // HH:MM
  const [seats, setSeats] = React.useState(''); // number

  function apply() {
    const p = new URLSearchParams();
    if (mode) p.set('mode', mode);
    if (time) p.set('time', time);
    if (seats) p.set('seats', seats);
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mode</span>
          <select
            className="h-9 rounded border px-2"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="">Any</option>
            <option value="taxi">Taxi</option>
            <option value="bus">Bus</option>
            <option value="boat">Boat</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Time</span>
          <input
            type="time"
            className="h-9 rounded border px-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Seats</span>
          <input
            type="number"
            min={1}
            className="h-9 w-24 rounded border px-2"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
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
