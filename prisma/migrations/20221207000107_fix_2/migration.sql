-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_authorId_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tweet" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
