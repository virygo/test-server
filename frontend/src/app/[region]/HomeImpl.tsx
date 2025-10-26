'use client';

// Χρησιμοποιούμε το υπάρχον Home component από το root (/src/app/page.tsx)
import RootHome from '../page';

export default function HomeImpl({ region }: { region: string }) {
  // Μπορείς προαιρετικά να το χρησιμοποιήσεις μέσα στο UI σου αν χρειαστεί
  console.log('Active region:', region);

  // Κάνει render το ίδιο Home που ήδη έχεις
  return <RootHome />;
}
