import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberType, MemberTypeIdEnum } from './member.query.js';
import { PrismaClient } from '@prisma/client';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },

    memberType: {
      type: MemberType,
      resolve: async (
        parent: { memberTypeId: string },
        args,
        context: { prisma: PrismaClient },
      ) => {
        return await context.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        });
      },
    },
  }),
});
