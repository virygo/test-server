// frontend/src/app/[region]/category/[slug]/layout.tsx
import React from 'react';
// σχετική διαδρομή από εδώ προς components/searchbar/SearchBarRoot.tsx
import SearchBarRoot from '../../../components/searchbar/SearchBarRoot';

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="px-3 pt-3 sm:px-6">
        <SearchBarRoot />
      </div>
      {children}
    </>
  );
}
