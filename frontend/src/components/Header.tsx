'use client';

import Link from 'next/link';
import LangSwitcher from './LangSwitcher';

export default function Header() {
  return (
    <div className="w-full bg-blue-600 text-white">
      <div className="mx-auto max-w-6xl px-6 h-12 flex items-center justify-between">
        {/* Αριστερά: τίτλος */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-extrabold tracking-tight text-lg">VIRYGO</span>
          <span className="opacity-90 text-sm">MYKONOS</span>
        </Link>

        {/* Μέση: γλώσσες */}
        <div className="hidden md:block">
          <LangSwitcher />
        </div>

        {/* Δεξιά: Login / Sign up */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="h-8 px-3 rounded-md bg-white/10 hover:bg-white/20 transition text-sm flex items-center"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="h-8 px-3 rounded-md bg-white text-blue-700 hover:bg-blue-50 transition text-sm flex items-center"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
