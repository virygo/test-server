import CategoryImpl from '../../../category/[slug]/CategoryImpl';

export default async function RegionCategoryPage({
  params,
}: {
  params: Promise<{ region: string; slug: string }>;
}) {
  const { region, slug } = await params;
  return <CategoryImpl region={region} slug={slug} />;
}
