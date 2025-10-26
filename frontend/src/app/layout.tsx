import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
//import { cookies } from 'next/headers';
import Header from '../components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Virygo',
  description:
    'Explore Mykonos with Virygo — Hotels, Food, Transport & Experiences',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Force ENGLISH globally
  //const locale = 'en';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Μόνιμο μπλε header σε όλες τις σελίδες */}
        <Header />

        {/* Περιεχόμενο κάθε σελίδας */}
        <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
