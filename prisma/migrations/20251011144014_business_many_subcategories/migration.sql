-- DropIndex
DROP INDEX "public"."Business_categoryId_subcategoryId_idx";

-- CreateTable
CREATE TABLE "BusinessSubcategory" (
    "businessId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "BusinessSubcategory_pkey" PRIMARY KEY ("businessId","subcategoryId")
);

-- CreateIndex
CREATE INDEX "BusinessSubcategory_subcategoryId_idx" ON "BusinessSubcategory"("subcategoryId");

-- CreateIndex
CREATE INDEX "Business_categoryId_idx" ON "Business"("categoryId");

-- AddForeignKey
ALTER TABLE "BusinessSubcategory" ADD CONSTRAINT "BusinessSubcategory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubcategory" ADD CONSTRAINT "BusinessSubcategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
