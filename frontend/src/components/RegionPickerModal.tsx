'use client';

import Image from 'next/image';

type Region = { key: string; name: string; country: string; image: string };

export default function RegionPickerModal({
  open,
  onClose,
  onSelect,
  regions,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (regionKey: string) => void;
  regions: Region[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      {/* sheet */}
      <div className="relative z-[101] w-[min(100vw,720px)] max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">Select destination</h3>
          <button
            className="text-sm opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-auto">
          {regions.map((r) => (
            <button
              key={r.key}
              onClick={() => onSelect(r.key)}
              className="relative group rounded-xl overflow-hidden border hover:shadow-md transition text-left"
            >
              <Image
                src={r.image}
                alt={r.name}
                width={600}
                height={400}
                className="h-40 w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="text-lg font-semibold leading-none">
                  {r.name}
                </div>
                <div className="text-xs opacity-90">{r.country}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
