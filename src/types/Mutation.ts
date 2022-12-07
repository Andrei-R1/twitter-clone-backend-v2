import { APP_SECRET, getUserId } from '../utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {
  intArg,
  nonNull,
  objectType,
  stringArg,
} from 'nexus'
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
  },
})