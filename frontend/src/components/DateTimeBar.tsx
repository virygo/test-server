'use client';
import React from 'react';

export type DateTimeValue = { date: string | null; time: string | null };

export default function DateTimeBar({
  value,
  onChange,
}: {
  value: DateTimeValue;
  onChange: (v: DateTimeValue) => void;
}) {
  return (
    <div
      style={{
        padding: 12,
        background: '#f7f7f7',
        borderBottom: '1px solid #eee',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        position: 'sticky',
        top: 48, // κάτω από το header
        zIndex: 5,
      }}
    >
      <label style={{ fontWeight: 600 }}>Date</label>
      <input
        type="date"
        value={value.date ?? ''}
        onChange={(e) => onChange({ ...value, date: e.target.value || null })}
        style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
      />
      <label style={{ fontWeight: 600 }}>Time</label>
      <input
        type="time"
        value={value.time ?? ''}
        onChange={(e) => onChange({ ...value, time: e.target.value || null })}
        style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
      />
    </div>
  );
}
