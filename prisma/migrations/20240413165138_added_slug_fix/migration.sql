/*
  Warnings:

  - Added the required column `slug` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "slug" VARCHAR NOT NULL;
