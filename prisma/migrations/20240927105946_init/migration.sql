-- CreateTable
CREATE TABLE "Festival" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "city_town" TEXT NOT NULL,
    "representative" TEXT,
    "overview" TEXT,
    "history" TEXT,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "festival_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "coordinates" TEXT NOT NULL,
    "start_datetime" TIMESTAMP(3),
    "end_datetime" TIMESTAMP(3),
    "is_shared" BOOLEAN NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "festival_id" INTEGER NOT NULL,
    "importance" TEXT NOT NULL,
    "posted_date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "festival_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT,
    "uploaded_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
