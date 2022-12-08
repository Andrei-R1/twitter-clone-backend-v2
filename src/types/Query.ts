import { getUserId } from '../utils'
import {
  objectType,
} from 'nexus'
import { Context } from '../context'

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.nonNull.list.nonNull.field('tweets', {
      type: 'Tweet',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.tweet.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        })
      },
    })

    t.nullable.field('tweet', {
      type: 'Tweet',
      resolve: (_parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.tweet.findUnique({
          where: {
            id: Number(userId),
          },
        })
      }
    })
  },
})