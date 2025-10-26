-- CreateEnum
CREATE TYPE "ProviderMode" AS ENUM ('OWN', 'PARTNER', 'HYBRID');

-- CreateEnum
CREATE TYPE "ListingSource" AS ENUM ('OWN', 'EXPEDIA');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "editedByHuman" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "externalSlug" TEXT,
ADD COLUMN     "listingSource" "ListingSource" NOT NULL DEFAULT 'OWN',
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "regionId" TEXT,
ADD COLUMN     "syncPolicy" TEXT;

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "providerMode" "ProviderMode" NOT NULL DEFAULT 'OWN',
    "provider" TEXT,
    "providerRegionId" TEXT,
    "featureConfig" JSONB,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentOverride" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "editedByHuman" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContentOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySourcePriority" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "source" "ListingSource" NOT NULL,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "InventorySourcePriority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderAttribution" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "label" TEXT,
    "logoUrl" TEXT,
    "legalText" TEXT,

    CONSTRAINT "ProviderAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE INDEX "Region_providerMode_slug_idx" ON "Region"("providerMode", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentOverride_businessId_field_key" ON "ContentOverride"("businessId", "field");

-- CreateIndex
CREATE INDEX "InventorySourcePriority_regionId_priority_idx" ON "InventorySourcePriority"("regionId", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "InventorySourcePriority_regionId_source_key" ON "InventorySourcePriority"("regionId", "source");

-- CreateIndex
CREATE INDEX "Business_regionId_idx" ON "Business"("regionId");

-- CreateIndex
CREATE INDEX "Business_listingSource_provider_idx" ON "Business"("listingSource", "provider");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentOverride" ADD CONSTRAINT "ContentOverride_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySourcePriority" ADD CONSTRAINT "InventorySourcePriority_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderAttribution" ADD CONSTRAINT "ProviderAttribution_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
