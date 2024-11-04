import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberTypeIdEnum } from '../query/member.query.js';
import { ProfileType } from '../query/profile.query.js';
import { PrismaClient } from '@prisma/client';
import { PostType } from '../query/post.query.js';
import { UserType } from '../query/user.query.js';

interface ICreateProfile {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  userId: string;
}

interface IChangeProfile {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

const createProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  }),
});

const changeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});

interface ICreatePost {
  title: string;
  content: string;
  authorId: string;
}

interface IChangePost {
  title: string;
  content: string;
}

const createPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

const changePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

interface ICreateUser {
  name: string;
  balance: number;
}

interface IChangeUser {
  name: string;
  balance: number;
}

const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const MutationsRootType = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: UserType as GraphQLObjectType,
      args: {
        dto: { type: new GraphQLNonNull(createUserInputType) },
      },
      resolve: async (
        _parent,
        args: { dto: ICreateUser },
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.user.create({ data: args.dto });
      },
    },

    changeUser: {
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeUserInputType) },
      },
      resolve: async (
        _parent,
        args: { id: string; dto: IChangeUser },
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { id: string },
        context: { prisma: PrismaClient },
      ) => {
        try {
          await context.prisma.user.delete({ where: { id: args.id } });
          return true;
        } catch {
          return false;
        }
      },
    },

    subscribeTo: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) => {
        try {
          await context.prisma.user.update({
            where: { id: args.userId },
            data: { userSubscribedTo: { create: { authorId: args.authorId } } },
          });
          return true;
        } catch {
          false;
        }
      },
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) => {
        try {
          await context.prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId,
              },
            },
          });
          return true;
        } catch {
          return false;
        }
      },
    },

    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(createProfileInputType) } },
      resolve: async (
        _parent,
        args: { dto: ICreateProfile },
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.profile.create({ data: args.dto });
      },
    },

    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeProfileInputType) },
      },
      resolve: async (
        _parent,
        args: { id: string; dto: IChangeProfile },
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { id: string },
        context: { prisma: PrismaClient },
      ) => {
        try {
          await context.prisma.profile.delete({ where: { id: args.id } });
          return true;
        } catch {
          return false;
        }
      },
    },

    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(createPostInputType) },
      },
      resolve: async (
        _parent,
        args: { dto: ICreatePost },
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.post.create({ data: args.dto });
      },
    },

    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: {
          type: new GraphQLNonNull(changePostInputType),
        },
      },
      resolve: async (
        _parent,
        args: { id: string; dto: IChangePost },
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { id: string },
        context: { prisma: PrismaClient },
      ) => {
        try {
          await context.prisma.post.delete({ where: { id: args.id } });
          return true;
        } catch {
          return false;
        }
      },
    },
  }),
});
