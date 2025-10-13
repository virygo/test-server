/*
  Warnings:

  - The `kind` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('COVER', 'GALLERY', 'LOGO', 'MENU', 'THUMB');

-- DropForeignKey
ALTER TABLE "public"."Media" DROP CONSTRAINT "Media_businessId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "businessId" DROP NOT NULL,
DROP COLUMN "kind",
ADD COLUMN     "kind" "MediaKind",
ALTER COLUMN "order" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
