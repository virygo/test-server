'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, ChangeEvent } from 'react';

// Τύπος για το drop-off mode
type DropOffMode = 'same' | 'other';

// Helper: μετατρέπει το query param σε σωστό τύπο
function toDropOffMode(v: string | null): DropOffMode {
  return v === 'other' ? 'other' : 'same';
}

export default function CarsSearchBar() {
  const router = useRouter();
  const qs = useSearchParams();

  // --- State με ΤΥΠΟΥΣ, χωρίς any ---
  const [pickUp, setPickUp] = useState<string>(qs.get('pickUp') || '');
  const [dropOffMode, setDropOffMode] = useState<DropOffMode>(
    toDropOffMode(qs.get('dropOffMode'))
  );
  const [dropOffPlace, setDropOffPlace] = useState<string>(
    qs.get('dropOff') || ''
  );
  const [dateFrom, setDateFrom] = useState<string>(qs.get('dateFrom') || '');
  const [dateTo, setDateTo] = useState<string>(qs.get('dateTo') || '');
  const [timeFrom, setTimeFrom] = useState<string>(
    qs.get('timeFrom') || '10:30'
  );
  const [timeTo, setTimeTo] = useState<string>(qs.get('timeTo') || '10:30');

  // --- Handlers με σωστούς τύπους (όχι any) ---
  const onPickUpChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPickUp(e.currentTarget.value);
  const onDropOffModeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setDropOffMode(e.currentTarget.value === 'other' ? 'other' : 'same');
  const onDropOffPlaceChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDropOffPlace(e.currentTarget.value);
  const onDateFromChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDateFrom(e.currentTarget.value);
  const onDateToChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDateTo(e.currentTarget.value);
  const onTimeFromChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTimeFrom(e.currentTarget.value);
  const onTimeToChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTimeTo(e.currentTarget.value);

  function submit() {
    const params = new URLSearchParams({
      pickUp,
      dropOffMode,
      dropOff: dropOffMode === 'same' ? pickUp : dropOffPlace,
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
    });
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] rounded-2xl border p-3 shadow-sm bg-white">
      <div className="grid gap-3 sm:grid-cols-4">
        <input
          placeholder="Pick-up"
          value={pickUp}
          onChange={onPickUpChange}
          className="h-12 rounded-lg border px-3"
        />

        <div>
          <select
            value={dropOffMode}
            onChange={onDropOffModeChange}
            className="h-12 w-full rounded-lg border px-3"
          >
            <option value="same">Drop-off: Same as pick-up</option>
            <option value="other">Drop-off: Different location</option>
          </select>

          {dropOffMode === 'other' && (
            <input
              placeholder="Drop-off location"
              value={dropOffPlace}
              onChange={onDropOffPlaceChange}
              className="mt-2 h-12 w-full rounded-lg border px-3"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={onDateFromChange}
            className="h-12 rounded-lg border px-3"
          />
          <input
            type="date"
            value={dateTo}
            onChange={onDateToChange}
            className="h-12 rounded-lg border px-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            value={timeFrom}
            onChange={onTimeFromChange}
            className="h-12 rounded-lg border px-3"
          />
          <input
            type="time"
            value={timeTo}
            onChange={onTimeToChange}
            className="h-12 rounded-lg border px-3"
          />
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={submit}
          className="h-12 rounded-lg px-6 font-semibold bg-blue-600 text-white"
        >
          Search
        </button>
      </div>
    </div>
  );
}
