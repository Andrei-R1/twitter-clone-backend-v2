/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Tweet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_authorId_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tweet" ALTER COLUMN "authorId" SET NOT NULL;

-- DropTable
DROP TABLE "Post";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
