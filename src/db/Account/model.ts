import { modelGetter } from '@db/util';
import type { Document, Model, QueryOptions } from 'mongoose';
import { addAccountMethods } from './methods';
import type { AccountSchemaType } from './schema';
import { AccountSchema } from './schema';
import { addAccountStatics } from './statics';

addAccountMethods(AccountSchema);
addAccountStatics(AccountSchema);

export interface AccountDocument extends Document, AccountSchemaType {
  regenerateRSAKeys(): void;
}

export interface AccountModel extends Model<AccountDocument> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findByEmail(email: string, projection?: any, options?: QueryOptions): ReturnType<AccountModel['findOne']>;
}

export const accountModelName = 'Account';

export const getAccountModel = modelGetter<AccountDocument, AccountModel>(accountModelName, AccountSchema);
