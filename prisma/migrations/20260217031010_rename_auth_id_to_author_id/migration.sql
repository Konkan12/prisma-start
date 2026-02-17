/*
  Warnings:

  - You are about to drop the column `authId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `authId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "comments_authId_idx";

-- DropIndex
DROP INDEX "posts_authId_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");
