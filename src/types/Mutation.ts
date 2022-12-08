import { APP_SECRET, getUserId } from '../utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { intArg, nonNull, objectType, stringArg } from 'nexus'
import { Context } from '../context'

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('createProfile', {
      type: 'Profile',
      args: {
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.profile.create({
          data: {
            bio: args.bio,
            location: args.location,
            website: args.website,
            avatar: args.avatar,
            userId: Number(userId),
          },
        })
      },
    })

    t.field('updateProfile', {
      type: 'Profile',
      args: {
        id: nonNull(intArg()),
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.profile.update({
          where: {
            id: args.id,
          },
          data: {
            bio: args.bio,
            location: args.location,
            website: args.website,
            avatar: args.avatar,
          },
        })
      },
    })

    t.field('createTweet', {
      type: 'Tweet',
      args: {
        content: stringArg(),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.tweet.create({
          data: {
            content: args.content,
            authorId: Number(userId),
          },
        })
      },
    })

    t.field('likeTweet', {
      type: 'LikedTweet',
      args: {
        tweetId: nonNull(intArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.likedTweet.create({
          data: {
            tweetId: Number(args.tweetId),
            userId: Number(userId),
          },
        })
      },
    })

    t.field('deleteLike',{
      type: 'LikedTweet',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.likedTweet.delete({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.field('createComment', {
      type: 'Comment',
      args: {
        content: nonNull(stringArg()),
        id: nonNull(intArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.comment.create({
          data: {
            content: args.content,
            tweetId: Number(args.id),
            userId: Number(userId),
          },
        })
      },
    })

    t.field('createReply', {
      type: 'Comment',
      args: {
        content: nonNull(stringArg()),
        id: nonNull(intArg()),
        commentId: intArg(),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.comment.create({
          data: {
            content: args.content,
            tweetId: Number(args.id),
            userId: Number(userId),
            commentId: Number(args.commentId),
          },
        })
      },
    })

    t.field('follow' , {
      type: 'Following',
      args: {
        name: nonNull(stringArg()),
        followId: nonNull(intArg()),
        avatar: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.following.create({
          data: {
            name: args.name,
            followId: Number(args.followId),
            avatar: args.avatar,
            userId: Number(userId),
          },
        })
      },
    })

    t.field('deleteFollow', {
      type: 'Following',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Not authenticated')
        return context.prisma.following.delete({
          where: {
            id: args.id,
          },
        })
      },
    })
  },
})