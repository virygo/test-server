// frontend/src/app/[region]/business/[slug]/page.tsx
import Image from 'next/image';

// ---- types (ό,τι χρειαζόμαστε για το detail) ----
type Media = { url: string };
type Rel = { slug: string };
type ApiItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  address1?: string | null;
  city?: string | null;
  country?: string | null;
  media?: Media[];
  region?: Rel | null;
  category?: Rel | null;
  subcategories?: { subcategory: Rel }[];
};

// ---- fetch helper ----
async function getBusiness(slug: string): Promise<ApiItem | null> {
  const base = process.env.API_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(
    `${base}/api/businesses/item/${encodeURIComponent(slug)}`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) return null;
  return res.json();
}

// ---- PAGE (Next.js 15: params είναι Promise) ----
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ περιμένουμε τα params
  const { slug } = await params;

  // ✅ φέρνουμε το business
  const item = await getBusiness(slug);

  // ✅ not-found state
  if (!item) {
    return (
      <main className="p-6 text-center text-gray-700">
        <p>Business not found.</p>
      </main>
    );
  }

  // ✅ από εδώ και κάτω ΜΟΝΟ ένα return
  const coverUrl = item.media?.[0]?.url ?? null;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {item.region?.slug ? `Region: ${item.region.slug}` : ''}
          {item.region?.slug && item.category?.slug ? ' · ' : ''}
          {item.category?.slug ? `Category: ${item.category.slug}` : ''}
        </p>
      </header>

      {coverUrl ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image src={coverUrl} alt={item.name} fill className="object-cover" />
        </div>
      ) : null}

      {item.description ? (
        <p className="text-gray-700">{item.description}</p>
      ) : null}

      <section className="space-y-1 text-sm">
        {item.address1 ? (
          <div>
            <b>Address:</b> {item.address1}
          </div>
        ) : null}
        {item.city ? (
          <div>
            <b>City:</b> {item.city}
          </div>
        ) : null}
        {item.country ? (
          <div>
            <b>Country:</b> {item.country}
          </div>
        ) : null}
      </section>
    </main>
  );
}
