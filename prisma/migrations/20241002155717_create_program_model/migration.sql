/*
  Warnings:

  - You are about to drop the column `end_datetime` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `is_shared` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `start_datetime` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "end_datetime",
DROP COLUMN "is_shared",
DROP COLUMN "start_datetime";

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "festival_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "location_id" INTEGER,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
