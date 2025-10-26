// frontend/src/app/[region]/page.tsx
import { use as usePromise } from 'react';
import HomeImpl from './HomeImpl'; // ✅ ΠΑΙΡΝΕΙ prop region

export default function RegionHome({
  params,
}: {
  params: Promise<{ region?: string }>;
}) {
  const { region } = usePromise(params); // Next.js 15: params είναι Promise
  const slug = (region ?? 'mykonos').toLowerCase(); // fallback

  return <HomeImpl region={slug} />; // ✅ περνάμε region prop
}
