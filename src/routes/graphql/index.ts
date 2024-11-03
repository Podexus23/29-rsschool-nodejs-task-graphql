import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const MemberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      BASIC: { value: 'BASIC' },
      BUSINESS: { value: 'BUSINESS' },
    },
  });

  const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      discount: { type: new GraphQLNonNull(GraphQLFloat) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    }),
  });

  // const ProfileType = new GraphQLObjectType({
  //   name: 'Profile',
  //   fields: () => ({
  //     id: { type: new GraphQLNonNull(UUIDType) },
  //     isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
  //     yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  //     memberType: {
  //       type: new GraphQLNonNull(MemberType),
  //       resolve: async (_source, { id }: { id: string }) => {
  //         return prisma.memberType.findUnique({ where: { id } });
  //       },
  //     },
  //   }),
  // });

  // const userType = new GraphQLObjectType({
  //   name: 'User',
  //   fields: () => ({
  //     id: { type: new GraphQLNonNull(UUIDType) },
  //     name: { type: new GraphQLNonNull(GraphQLString) },
  //     balance: { type: new GraphQLNonNull(GraphQLFloat) },
  //     profile: {
  //       type: ProfileType,
  //       resolve: async (_source, { id }: { id: string }) => {
  //         return prisma.user.findUnique({ id });
  //       },
  //     },
  //   }),
  // });

  const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async () => {
          return prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        },
        resolve: async (_source, { id }: { id: string }) => {
          return prisma.memberType.findUnique({ where: { id } });
        },
      },
      // users,
      // user,
      // posts,
      // post,
      // profiles,
      // profile
    },
  });

  const schema = new GraphQLSchema({
    query: RootQueryType,
    // mutation: Mutations,
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      return graphql({
        schema,
        source: query,
        variableValues: variables,
      });
    },
  });
};

export default plugin;
