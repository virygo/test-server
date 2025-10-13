/*
  Warnings:

  - You are about to drop the column `active` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId,slug]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Service_businessId_idx";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_businessId_slug_key" ON "Service"("businessId", "slug");
