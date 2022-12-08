import { objectType } from "nexus"


export const LikedTweet = objectType({
  name: 'LikedTweet',
  definition(t) {
    t.nonNull.int('id')
    t.field('tweet', {
      type: 'Tweet',
      resolve: (parent, _, context) => {
        return context.prisma.likedTweet
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .tweet()
      },
    })
    t.nonNull.field('likedAt', { type: 'DateTime' })
    t.field('user', {
      type: 'User',
      resolve: (parent, _, context) => {
        return context.prisma.likedTweet
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .user()
      },
    })
  },
})