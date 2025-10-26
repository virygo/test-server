// frontend/src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // αν μπαίνουμε στο root "/"
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/destinations', req.url));
  }
  return NextResponse.next();
}

// τρέχει μόνο για το "/"
export const config = {
  matcher: ['/'],
};
