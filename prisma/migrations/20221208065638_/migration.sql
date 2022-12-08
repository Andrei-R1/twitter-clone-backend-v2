-- DropForeignKey
ALTER TABLE "LikedTweet" DROP CONSTRAINT "LikedTweet_tweetId_fkey";

-- AlterTable
ALTER TABLE "LikedTweet" ALTER COLUMN "tweetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LikedTweet" ADD CONSTRAINT "LikedTweet_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
