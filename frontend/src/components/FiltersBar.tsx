'use client';
import React, { useMemo } from 'react';

export default function FiltersBar({
  subcats,
  selectedSubs,
  onToggleSub,
  onOpenFilters,
}: {
  subcats: string[];
  selectedSubs: string[];
  onToggleSub: (slug: string) => void;
  onOpenFilters: () => void;
}) {
  const barStyle: React.CSSProperties = {
    padding: 12,
    background: '#fff',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 92, // κάτω από την DateTimeBar
    zIndex: 4,
  };

  const btnBase: React.CSSProperties = {
    display: 'inline-block',
    marginRight: 8,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: 999,
    fontSize: 14,
    cursor: 'pointer',
    background: '#fff',
  };

  return (
    <div style={barStyle}>
      {subcats.map((s) => {
        const active = selectedSubs.includes(s);
        return (
          <button
            key={s}
            type="button"
            onClick={() => onToggleSub(s)}
            style={{
              ...btnBase,
              background: active ? '#e8f0ff' : '#fff',
              borderColor: active ? '#4f7cff' : '#ddd',
              fontWeight: active ? 700 : 500,
            }}
            title={s}
          >
            {s}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onOpenFilters}
        style={{ ...btnBase, marginLeft: 8, background: '#f7f7ff' }}
        title="Άνοιγμα όλων των φίλτρων"
      >
        All Filters
      </button>
    </div>
  );
}
