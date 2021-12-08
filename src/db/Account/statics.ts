import { staticsAdditor } from '@db/util';
import type { AccountDocument, AccountModel } from './model';

export const addAccountStatics = staticsAdditor<AccountDocument, AccountModel>({
  findByEmail(email, projection, options) {
    return this.findOne({ email }, projection, options);
  },
});
