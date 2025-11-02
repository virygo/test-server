'use client';
import React from 'react';

type Props = {
  /** κείμενο στο κουμπί που ανοίγει το panel */
  triggerLabel: string;
  /** extra classes για το κουμπί */
  triggerClassName?: string;
  /** τίτλος στο panel */
  panelTitle?: string;
  /** ό,τι φίλτρα θες να εμφανίσεις μέσα στο panel */
  children?: React.ReactNode;
};

/**
 * FiltersBar
 * - Κάνει render ένα ΚΟΥΜΠΙ (trigger)
 * - Όταν πατηθεί ανοίγει overlay/modal με τα children (τα πραγματικά φίλτρα)
 * - Δεν κάνει render φίλτρα πάνω στη σελίδα — μόνο μέσα στο panel.
 */
export default function FiltersBar({
  triggerLabel,
  triggerClassName,
  panelTitle,
  children,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // ESC για κλείσιμο
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // click-outside για κλείσιμο
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName ?? 'rounded-md border px-4 py-2'}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="w-[90%] max-w-md rounded-lg bg-white p-4 shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {panelTitle ?? 'Filters'}
              </h3>
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
