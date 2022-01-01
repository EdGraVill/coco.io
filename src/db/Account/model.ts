import type { SchemaLayerBase } from '@db/types';
import { modelGetter } from '@db/util';
import type { Document, Model, ObjectId, QueryOptions } from 'mongoose';
import { addAccountMethods } from './methods';
import type { AccountSchemaType } from './schema';
import { AccountSchema } from './schema';
import { addAccountStatics } from './statics';

addAccountMethods(AccountSchema);
addAccountStatics(AccountSchema);

export interface AccountDocument extends Document, AccountSchemaType {
  changePassword(oldPassword: string, newPassword: string): Promise<AccountDocument>;
  regenerateRSAKeys(): Promise<AccountDocument>;
  setAdminStatus(accountId: ObjectId, newStatus: boolean, confirmationCode?: string): Promise<AccountDocument>;
  validateAdmin(): void;
}

export interface AccountModel extends Model<AccountDocument> {
  addNew(newAccountInformation: Omit<AccountSchemaType, 'RSA' | keyof SchemaLayerBase>): Promise<AccountDocument>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findByEmail(email: string, projection?: any, options?: QueryOptions): ReturnType<AccountModel['findOne']>;
  restorePassword(email: string, newPassword: string, confirmationCode?: string): Promise<AccountDocument>;
}

export const accountModelName = 'Account';

export const getAccountModel = modelGetter<AccountDocument, AccountModel>(accountModelName, AccountSchema);
