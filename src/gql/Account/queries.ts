import type { AccountSchemaType } from '@db/Account';
import { getAccountModel } from '@db/Account';
import type { GraphQLAdminCTX, GraphQLPrivateCTX } from 'gql/rootSchema';
import { getSelectedFields } from 'gql/util';
import type { GraphQLArgumentConfig, GraphQLFieldConfig } from 'graphql';
import { GraphQLBoolean } from 'graphql';
import { GraphQLString } from 'graphql';
import { GraphQLList, GraphQLNonNull } from 'graphql';
import type { EmptyObject } from 'types';
import { GraphQLAccountType } from './schemas';

type AccountQueryArgs = Partial<Pick<AccountSchemaType, 'email' | 'firstName' | 'lastName'>>;

const accountQuery: GraphQLFieldConfig<EmptyObject, GraphQLAdminCTX, AccountQueryArgs> = {
  args: {
    email: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  } as Record<keyof AccountQueryArgs, GraphQLArgumentConfig>,
  async resolve(src, args, ctx, info) {
    const selection = getSelectedFields(info);

    const Accounts = await getAccountModel().find(args).select(selection).lean();

    return Accounts;
  },
  type: new GraphQLNonNull(new GraphQLList(GraphQLAccountType)),
};

const amIAdminQuery: GraphQLFieldConfig<EmptyObject, GraphQLPrivateCTX> = {
  resolve() {
    return true;
  },
  type: new GraphQLNonNull(GraphQLBoolean),
};

const myAccountQuery: GraphQLFieldConfig<EmptyObject, GraphQLPrivateCTX> = {
  resolve(src, args, ctx) {
    // return ctx.session.account;
  },
  type: new GraphQLNonNull(GraphQLAccountType),
};

export const accountAdminQueries = {
  account: accountQuery,
  amIAdmin: amIAdminQuery,
  myAccount: myAccountQuery,
};

export const accountPrivateQueries = {
  myAccount: myAccountQuery,
};
