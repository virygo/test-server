'use client';
import { useRouter } from 'next/navigation';

export default function TransportActions() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[980px] rounded-2xl border p-3 shadow-sm bg-white mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={() => router.push('/transport/taxi/now')}
          className="h-12 rounded-lg px-6 font-semibold bg-green-600 text-white"
        >
          Taxi now
        </button>
        <button
          onClick={() => router.push('/transport/taxi/schedule')}
          className="h-12 rounded-lg px-6 font-semibold bg-blue-600 text-white"
        >
          Book later
        </button>
      </div>
    </div>
  );
}
