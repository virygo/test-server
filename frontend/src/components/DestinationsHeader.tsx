'use client';
import Link from 'next/link';
import LangSwitcher from '../components/LangSwitcher';

export default function DestinationsHeader({
  onOpenRegionPicker,
}: {
  onOpenRegionPicker: () => void;
}) {
  return (
    <header className="w-full bg-blue-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-2 select-none">
          <span className="text-xl font-bold tracking-wide">VIRYGO</span>
          <span className="text-sm opacity-90">MYKONOS</span>
        </Link>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <button
            type="button"
            onClick={onOpenRegionPicker}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50/10"
          >
            Choose region
          </button>
          <Link href="/login" className="text-sm px-2 py-1 hover:underline">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium rounded-md px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
