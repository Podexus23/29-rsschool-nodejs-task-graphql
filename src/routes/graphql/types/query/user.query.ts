import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { ProfileType } from './profile.query.js';
import { PrismaClient } from '@prisma/client';
import { PostType } from './post.query.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (
        parent: { id: string },
        args,
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.profile.findUnique({
          where: { userId: parent.id },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (
        parent: { id: string },
        args,
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        parent: { id: string },
        args,
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: parent.id } } },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        parent: { id: string },
        args,
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: parent.id } } },
        });
      },
    },
  }),
});
