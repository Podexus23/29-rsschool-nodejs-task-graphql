import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeIdEnum } from './member.query.js';
import { PrismaClient } from '@prisma/client';
import { UserType } from './user.query.js';
import { UUIDType } from '../uuid.js';
import { PostType } from './post.query.js';
import { ProfileType } from './profile.query.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_, args, context: { prisma: PrismaClient }) => {
        return await context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (_, { id }: { id: string }, context) => {
        const res = await context.prisma.memberType.findUnique({ where: { id } });

        return res;
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_, args, context) => {
        return await context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context) => {
        return await context.prisma.user.findUnique({ where: { id } });
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { id: string }, context) => {
        return await context.prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_, args, context) => {
        return await context.prisma.post.findMany();
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_, args, context) => {
        return await context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: { id: string }, context) => {
        return await context.prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
