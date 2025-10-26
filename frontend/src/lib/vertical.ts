// πρόσθεσε ΟΛΕΣ τις κάθετες εδώ
export type Vertical =
  | 'stays'
  | 'etickets'
  | 'food'
  | 'nightlife'
  | 'beach'
  | 'transport'
  | 'rentals'
  | 'bwf' // Beauty • Wellness • Fitness
  | 'activities'
  | 'culture'
  | 'default'; // προαιρετικό fallback

export function verticalFromSlug(slug?: string): Vertical {
  const s = (slug ?? '').toLowerCase();

  // map πιθανά slugs -> κάθετη
  const map: Record<string, Vertical> = {
    // Stay
    stay: 'stays',
    stays: 'stays',

    // E-tickets
    'e-tickets': 'etickets',
    etickets: 'etickets',

    // Food
    food: 'food',

    // Nightlife
    nightlife: 'nightlife',

    // Beach / Beach club
    beach: 'beach',
    beaches: 'beach',
    'beach-club': 'beach',

    // Transport
    transport: 'transport',
    transports: 'transport',

    // Rentals
    rentals: 'rentals',
    rental: 'rentals',

    // Beauty • Wellness • Fitness
    bwf: 'bwf',
    'beauty-wellness-fitness': 'bwf',

    // Activities
    activities: 'activities',
    activity: 'activities',

    // Culture
    culture: 'culture',
  };

  return map[s] ?? 'default';
}
