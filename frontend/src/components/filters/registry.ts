// src/components/filters/registry.ts
import type React from 'react';

// --- Filters per category (μοναδικό component για κάθε κατηγορία) ---
import StayFilters from '../searchbar/variants/stay/StayFilters';
import RentalsFilters from './rentals/RentalsFilters';
import EticketsFilters from './etickets/ETicketsFilters';
import TransportFilters from './transport/TransportFilters';
import FoodFilters from './food/FoodFilters';
import NightlifeFilters from './nightlife/NightlifeFilters';
import ActivitiesFilters from './activities/ActivitiesFilters';
import BeachFilters from './beach/BeachFilters';
import BwfFilters from './bwf/BwfFilters';
import CultureFilters from './culture/CultureFilters';

// Επιτρέπουμε props χωρίς να χρησιμοποιήσουμε explicit any
type AnyProps = { [key: string]: unknown };
type Registry = Record<string, React.ComponentType<AnyProps>>;

/**
 * Κανoνικοί (canonical) slugs = όπως υπάρχουν στο DB (Prisma):
 * stay, e_tickets, food, nightlife, beach_club, on-demand-transport,
 * beauty_wellness_fitness, rentals, activities, history_culture
 */
const FILTERS_BY_CATEGORY: Registry = {
  // DB slugs → Components
  stay: StayFilters,
  e_tickets: EticketsFilters,
  food: FoodFilters,
  nightlife: NightlifeFilters,
  beach_club: BeachFilters,
  'on-demand-transport': TransportFilters,
  beauty_wellness_fitness: BwfFilters,
  rentals: RentalsFilters,
  activities: ActivitiesFilters,
  history_culture: CultureFilters,
};

// Προαιρετικό fallback ώστε να μην επιστρέφουμε ποτέ undefined
const Fallback: React.FC = () => null;

// -------------------------
// UI → DB slug aliases
// -------------------------
// Ό,τι έρχεται από URL/route/UI το χαρτογραφούμε στον κανονικό DB slug
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  // εναλλακτικά/φιλικά UI slugs
  stays: 'stay',
  e_tickets: 'e_tickets',
  food: 'food',
  nightlife: 'nightlife',
  beach_club: 'beach_club',
  transport: 'on-demand-transport', // <— σημαντικό alias
  beauty_wellness_fitness: 'beauty_wellness_fitness',
  rentals: 'rentals',
  activities: 'activities',
  culture: 'history_culture', // UI "culture" → DB "history_culture"
};

// Helper: αντικαθιστά underscores/hyphens & εφαρμόζει alias
function resolveKey(slug: string): string {
  // π.χ. "beauty-wellness-fitness" → "beauty-wellness-fitness"
  //      "e_tickets" → "e-tickets" (ενδιάμεσο), μετά alias ή επιστροφή
  const normalized = slug.replace(/_/g, '-');
  // πρώτα κοιτάμε alias με το normalized
  const viaAlias = CATEGORY_SLUG_ALIASES[normalized];
  if (viaAlias) return viaAlias;
  // αν δεν υπάρχει alias, επιστρέφουμε το αρχικό DB style:
  // — αν το FILTERS_BY_CATEGORY έχει key που ταιριάζει με normalized, το επιστρέφουμε
  // — ειδάλλως, προσπάθησε να ξαναφέρεις underscores (DB style) για τυχόν αντιστοιχία
  if (FILTERS_BY_CATEGORY[normalized]) return normalized;
  const backToUnderscore = normalized.replace(/-/g, '_');
  return CATEGORY_SLUG_ALIASES[backToUnderscore] ?? backToUnderscore;
}

// Επιστρέφει το σωστό component για φίλτρα της κατηγορίας
export function getFiltersFor(slug: string): React.ComponentType<AnyProps> {
  const key = resolveKey(slug);
  return FILTERS_BY_CATEGORY[key] ?? Fallback;
}

// Χρήσιμο για debug
export const FILTER_KEYS = Object.keys(FILTERS_BY_CATEGORY);
