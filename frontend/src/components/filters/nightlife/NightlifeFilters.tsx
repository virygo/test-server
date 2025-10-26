'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function NightlifeFilters({ onApply }: Props) {
  const [kind, setKind] = React.useState(''); // bar/club/lounge
  const [music, setMusic] = React.useState('');
  const [age, setAge] = React.useState('');

  function apply() {
    const p = new URLSearchParams();
    if (kind) p.set('kind', kind);
    if (music) p.set('music', music);
    if (age) p.set('age', age);
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
            <option value="bar">Bar</option>
            <option value="club">Club</option>
            <option value="lounge">Lounge</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Music</span>
          <input
            className="h-9 rounded border px-2"
            placeholder="house, pop, rnb..."
            value={music}
            onChange={(e) => setMusic(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Age</span>
          <select
            className="h-9 rounded border px-2"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">Any</option>
            <option>18+</option>
            <option>21+</option>
            <option>25+</option>
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
