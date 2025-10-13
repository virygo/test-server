'use client';

import Link from 'next/link';
import LangSwitcher from './LangSwitcher';

export default function Header() {
  return (
    <header className="w-full bg-[#0a66ff] text-white">
      <div className="mx-auto max-w-6xl px-3 h-12 flex items-center justify-between">
        {/* Left: logo */}
        <Link href="/" className="font-semibold tracking-wide">
          VIRYGO <span className="opacity-80">MYKONOS</span>
        </Link>

        {/* Right: language BEFORE auth */}
        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/signup" className="hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
