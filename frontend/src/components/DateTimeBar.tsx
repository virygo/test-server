// src/components/DateTimeBar.tsx
'use client';
import React from 'react';

export type DateTimeValue = { date?: string | null; time?: string | null };
type Props = {
  value?: DateTimeValue;
  onChange?: (v: DateTimeValue) => void;
};

export default function DateTimeBar({ value, onChange }: Props) {
  const [local, setLocal] = React.useState<DateTimeValue>({
    date: value?.date ?? '',
    time: value?.time ?? '',
  });

  React.useEffect(() => {
    setLocal({
      date: value?.date ?? '',
      time: value?.time ?? '',
    });
  }, [value?.date, value?.time]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...local, date: e.target.value || '' };
    setLocal(updated);
    onChange?.(updated);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...local, time: e.target.value || '' };
    setLocal(updated);
    onChange?.(updated);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="date"
        value={local.date ?? ''}
        onChange={handleDateChange}
        style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
      />
      <input
        type="time"
        value={local.time ?? ''}
        onChange={handleTimeChange}
        style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
      />
    </div>
  );
}
