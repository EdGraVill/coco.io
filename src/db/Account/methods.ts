import { getConfirmationModel } from '@db/Confirmation';
import { methodsAdditor } from '@db/util';
import { compare, hash } from 'bcryptjs';
import NodeRSA from 'node-rsa';
import { getAccountModel } from './model';
import type { AccountDocument } from './model';
import type { AccountSchemaType } from './schema';

export const addAccountMethods = methodsAdditor<AccountSchemaType, AccountDocument>({
  async changePassword(oldPassword, newPassword) {
    const isOldPasswordCorrect = await compare(oldPassword, this.password);

    if (!isOldPasswordCorrect) {
      throw new Error('Current password is incorrect');
    }

    this.password = await hash(newPassword, 10);

    return this.save();
  },
  async regenerateRSAKeys() {
    const keychain = new NodeRSA({ b: 2048 });

    this.RSA.privateKey = keychain.exportKey('private');
    this.RSA.publicKey = keychain.exportKey('public');

    return this.save();
  },
  async setAdminStatus(accountId, newStatus, confirmationCode) {
    this.validateAdmin();

    const Account = await getAccountModel().findById(accountId);

    if (!Account) {
      throw new Error('Account not found');
    }

    const confirmationPayload = getConfirmationModel().hashPayload({ accountId, newStatus });
    if (!confirmationCode) {
      const { code } = await getConfirmationModel().addNew(confirmationPayload);

      console.log(code);
    } else {
      const result = await getConfirmationModel().verify(confirmationCode, confirmationPayload);

      if (!result) {
        throw new Error('Invalid Confirmation Code');
      }
    }

    Account.isAdmin = newStatus;

    return Account.save();
  },
  validateAdmin() {
    if (!this.isAdmin) {
      throw new Error('Insufficient permissions');
    }
  },
});
