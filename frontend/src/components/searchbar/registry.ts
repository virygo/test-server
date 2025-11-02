'use client';
import type { ComponentType } from 'react';

import StaySearchBar from './variants/StaySearchBar';
import CarsSearchBar from './variants/CarsSearchBar';
import TransportActions from './variants/TransportActions';
import SearchBarRoot from './SearchBarRoot';

export type SearchBarProps = { region: string; slug: string };

const SEARCHBAR_BY_CATEGORY: Record<string, ComponentType<SearchBarProps>> = {
  stay: StaySearchBar, // ημερομηνίες + travelers/rooms
  rentals: CarsSearchBar, // ημερομηνίες + ώρα παραλαβής/παράδοσης
  e_tickets: SearchBarRoot, // generic (ημερομηνία)
  transport: TransportActions, // now / later επιλογή

  // προσωρινά generic μέχρι να φτιαχτούν ειδικές μπάρες:
  food: SearchBarRoot,
  nightlife: SearchBarRoot,
  activities: SearchBarRoot,
  beach_club: SearchBarRoot,
  beauty_wellness_fitness: SearchBarRoot,
  culture: SearchBarRoot,
};

export function getSearchbarFor(slug: string): ComponentType<SearchBarProps> {
  return SEARCHBAR_BY_CATEGORY[slug] ?? SearchBarRoot;
}
