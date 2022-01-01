import type { AccountDocument } from '@db/Account';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const GraphQLAccountType = new GraphQLObjectType<AccountDocument>({
  fields: () => ({
    email: {
      resolve(src) {
        return src.email;
      },
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      resolve(src) {
        return src.firstName;
      },
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      resolve(src) {
        return src.lastName;
      },
      type: new GraphQLNonNull(GraphQLString),
    },
    publicKey: {
      resolve(src) {
        return src.RSA.publicKey;
      },
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
  name: 'GraphQLAccountType',
});
