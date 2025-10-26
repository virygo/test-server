'use client';
import React from 'react';
import { verticalFromSlug } from '../../lib/vertical';

// --- Imports για τα ξεχωριστά φίλτρα ανά κατηγορία ---
import StayFilters from '../searchbar/variants/stay/StayFilters';
import ETicketsFilters from './etickets/ETicketsFilters';
import FoodFilters from './food/FoodFilters';
import NightlifeFilters from './nightlife/NightlifeFilters';
import BeachFilters from './beach/BeachFilters';
import TransportFilters from './transport/TransportFilters';
import RentalsFilters from './rentals/RentalsFilters';
import BwfFilters from './bwf/BwfFilters';
import ActivitiesFilters from './activities/ActivitiesFilters';
import CultureFilters from './culture/CultureFilters';

// Τύπος props που θα παίρνει το container φίλτρων
type Props = {
  slug: string; // π.χ. "stay", "rentals", "food"...
  onApply?: (params: URLSearchParams) => void;
};

// Ενιαίο wrapper: με βάση το slug κάνει render τα σωστά φίλτρα
export default function CategoryFilters({ slug, onApply }: Props) {
  const v = verticalFromSlug(slug); // π.χ. "stays", "rentals", "food", "transport", "bwf"...

  switch (v) {
    case 'stays':
      return <StayFilters onApply={onApply} />;

    case 'etickets':
      return <ETicketsFilters onApply={onApply} />;

    case 'food':
      return <FoodFilters onApply={onApply} />;

    case 'nightlife':
      return <NightlifeFilters onApply={onApply} />;

    case 'beach':
      return <BeachFilters onApply={onApply} />;

    case 'transport':
      return <TransportFilters onApply={onApply} />;

    case 'rentals':
      return <RentalsFilters onApply={onApply} />;

    case 'bwf': // Beauty • Wellness • Fitness
      return <BwfFilters onApply={onApply} />;

    case 'activities':
      return <ActivitiesFilters onApply={onApply} />;

    case 'culture':
      return <CultureFilters onApply={onApply} />;

    default:
      // Αν για κάποιο λόγο δεν ταιριάζει κάτι, μην ρίχνουμε σφάλμα – απλά μηδέν UI
      return null;
  }
}
