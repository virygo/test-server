'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function ActivitiesFilters({ onApply }: Props) {
  const [difficulty, setDifficulty] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [group, setGroup] = React.useState('');

  function apply() {
    const p = new URLSearchParams();
    if (difficulty) p.set('difficulty', difficulty);
    if (duration) p.set('duration', duration);
    if (group) p.set('group', group);
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-8 items-center border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Difficulty</span>
          <select
            className="h-9 rounded border px-2"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Any</option>
            <option>easy</option>
            <option>moderate</option>
            <option>hard</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Duration (h)</span>
          <input
            type="number"
            className="h-9 w-24 rounded border px-2"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Group size</span>
          <input
            type="number"
            className="h-9 w-24 rounded border px-2"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
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
