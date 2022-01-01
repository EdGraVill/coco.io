import { getConfirmationModel } from '@db/Confirmation';
import { staticsAdditor } from '@db/util';
import { hash } from 'bcryptjs';
import type { AccountDocument, AccountModel } from './model';

export const addAccountStatics = staticsAdditor<AccountDocument, AccountModel>({
  addNew(newAccountInformation) {
    return new this(newAccountInformation).save();
  },
  findByEmail(email, projection, options) {
    return this.findOne({ email }, projection, options);
  },
  async restorePassword(email, newPassword, confirmationCode) {
    const Account = await this.findByEmail(email);

    if (!Account) {
      throw new Error('Account not found');
    }

    const confirmationPayload = getConfirmationModel().hashPayload({ email, newPassword });
    if (!confirmationCode) {
      const { code } = await getConfirmationModel().addNew(confirmationPayload);

      console.log(code);
    } else {
      const result = await getConfirmationModel().verify(confirmationCode, confirmationPayload);

      if (!result) {
        throw new Error('Invalid Confirmation Code');
      }
    }

    Account.password = await hash(newPassword, 10);

    return Account.save();
  },
});
