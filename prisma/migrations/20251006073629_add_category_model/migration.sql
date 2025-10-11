/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'VENDOR', 'ADMIN');

-- AlterTable
ALTER TABLE "User" 
  ADD COLUMN "password" TEXT,
  ADD COLUMN "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  ADD COLUMN "username" TEXT NOT NULL DEFAULT 'temp-username';

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Category"
ADD COLUMN "slug" TEXT NOT NULL DEFAULT 'temp-slug';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
