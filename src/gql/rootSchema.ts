import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import type { NextApiRequest } from 'next';
import type { EmptyObject } from 'types';
import { accountAdminQueries, accountPrivateQueries } from './Account';

export type GraphQLAdminCTX = NextApiRequest & { isAdmin: true };
export type GraphQLPrivateCTX = NextApiRequest;
export type GraphQLPublicCTX = NextApiRequest;

export const adminRootSchema = new GraphQLSchema({
  query: new GraphQLObjectType<EmptyObject, GraphQLAdminCTX>({
    fields: () => ({
      ...accountAdminQueries,
    }),
    name: 'GraphQLPrivateQueryType',
  }),
});

export const privateRootSchema = new GraphQLSchema({
  query: new GraphQLObjectType<EmptyObject, GraphQLPrivateCTX>({
    fields: () => ({
      ...accountPrivateQueries,
    }),
    name: 'GraphQLPrivateQueryType',
  }),
});
