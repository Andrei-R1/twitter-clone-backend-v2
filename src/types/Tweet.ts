import {
  objectType,
} from 'nexus'
import { Context } from '../context'

export const Tweet = objectType({
  name: 'Tweet',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.string('content')
    t.field('author', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.tweet
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author()
      },
    })
    t.list.field('likes', {
      type: 'LikedTweet',
      resolve: (parent, _, context: Context) => {
        return context.prisma.tweet
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .likes()
      },
    }) 
  },
})