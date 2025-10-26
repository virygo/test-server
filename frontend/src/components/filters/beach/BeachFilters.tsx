'use client';
import React from 'react';
type Props = { onApply?: (params: URLSearchParams) => void };

export default function BeachFilters({ onApply }: Props) {
  const [family, setFamily] = React.useState(false);
  const [party, setParty] = React.useState(false);
  const [sunbeds, setSunbeds] = React.useState(false);
  const [parking, setParking] = React.useState(false);

  function apply() {
    const p = new URLSearchParams();
    if (family) p.set('family', '1');
    if (party) p.set('party', '1');
    if (sunbeds) p.set('sunbeds', '1');
    if (parking) p.set('parking', '1');
    onApply?.(p);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-3 mt-3">
      <div className="flex flex-wrap gap-6 items-center border rounded-lg p-3 bg-white">
        {[
          { label: 'Family', v: family, set: setFamily },
          { label: 'Party', v: party, set: setParty },
          { label: 'Sunbeds', v: sunbeds, set: setSunbeds },
          { label: 'Parking', v: parking, set: setParking },
        ].map((x) => (
          <label key={x.label} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={x.v}
              onChange={(e) => x.set(e.target.checked)}
            />
            {x.label}
          </label>
        ))}
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
