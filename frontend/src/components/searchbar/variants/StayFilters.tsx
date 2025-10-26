'use client';
import React from 'react';

export default function StayFilters() {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <button className="px-3 py-1 border rounded-md text-sm">
        Free cancellation
      </button>
      <button className="px-3 py-1 border rounded-md text-sm">
        Breakfast included
      </button>
      <button className="px-3 py-1 border rounded-md text-sm">Pool</button>
      <button className="px-3 py-1 border rounded-md text-sm">Sea view</button>
    </div>
  );
}
