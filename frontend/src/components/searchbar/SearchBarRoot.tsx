'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';

// helpers
import { verticalFromSlug } from '../../lib/vertical';

// --- Variants (per category) ---
import StaySearchBar from './variants/StaySearchBar';
import CarsSearchBar from './variants/CarsSearchBar';
import TransportActions from './variants/TransportActions';

// --- Old bar (fallback ONLY for categories που δεν έχουν δικό τους variant) ---
import DefaultDateTimeBar from '../DateTimeBar';

/**
 * Μικρό wrapper ώστε η παλιά μπάρα (DefaultDateTimeBar) να παίρνει
 * αρχικές τιμές από το query string (date, time) και σωστό onChange.
 * Χρησιμοποιείται ΜΟΝΟ ως fallback.
 */
function DefaultBarWrapper() {
  const qs = useSearchParams();

  type P = React.ComponentProps<typeof DefaultDateTimeBar>;
  const [value, setValue] = React.useState<P['value']>(() => {
    return {
      date: qs.get('date') || '',
      time: qs.get('time') || '',
    } as P['value'];
  });

  return <DefaultDateTimeBar value={value} onChange={setValue} />;
}

/**
 * Root component: επιλέγει ποια μπάρα θα δείξει ανά κατηγορία.
 * - stay  -> StaySearchBar (destination, dates, travelers, rooms, Search δεξιά)
 * - cars  -> CarsSearchBar
 * - transport -> TransportActions
 * - otherwise -> DefaultBarWrapper (παλιά μπάρα)
 */
export default function SearchBarRoot() {
  // Αν είσαι σε route τύπου /[region]/category/[slug]
  const params = useParams() as { region?: string; slug?: string };

  // Παίρνουμε το vertical από το slug (π.χ. "stay", "cars", "transport")
  const vertical = verticalFromSlug(params?.slug || '');

  // --- Per-category variants (ξεχωριστά φίλτρα ανά κατηγορία) ---
  if (vertical === 'stays') return <StaySearchBar />;
  if (vertical === 'rentals') return <CarsSearchBar />;
  if (vertical === 'transport') return <TransportActions />;

  // --- Fallback: παλιά μπάρα μόνο όπου δεν έχουμε δικό μας variant
  return <DefaultBarWrapper />;
}
