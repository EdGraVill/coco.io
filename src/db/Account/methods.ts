import { methodsAdditor } from '@db/util';
import NodeRSA from 'node-rsa';
import type { AccountDocument } from './model';
import type { AccountSchemaType } from './schema';

export const addAccountMethods = methodsAdditor<AccountSchemaType, AccountDocument>({
  regenerateRSAKeys() {
    const keychain = new NodeRSA({ b: 2048 });

    this.RSA.privateKey = keychain.exportKey('private');
    this.RSA.publicKey = keychain.exportKey('public');
  },
});
