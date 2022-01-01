import type { SchemaLayer, InterfaceToSchema } from '@db/types';
import { createSchema } from '@db/util';
import { hash } from 'bcryptjs';
import { Schema } from 'mongoose';
import NodeRSA from 'node-rsa';
import type { AccountDocument } from './model';

export type AccountSchemaType = SchemaLayer<{
  RSA: {
    privateKey: string;
    publicKey: string;
  };
  email: string;
  firstName: string;
  isAdmin: boolean;
  lastName: string;
  password: string;
}>;

export const accountSchemaDefinition: InterfaceToSchema<AccountSchemaType> = {
  RSA: {
    privateKey: {
      type: Schema.Types.String,
    },
    publicKey: {
      type: Schema.Types.String,
    },
  },
  email: {
    index: true,
    required: [true, 'Correo electrónico requerido'],
    type: Schema.Types.String,
    unique: true,
  },
  firstName: {
    required: true,
    type: Schema.Types.String,
  },
  isAdmin: {
    default: false,
    type: Schema.Types.Boolean,
  },
  lastName: {
    required: true,
    type: Schema.Types.String,
  },
  password: {
    required: true,
    type: Schema.Types.String,
  },
};

export const AccountSchema = createSchema(accountSchemaDefinition, undefined, {
  'email_1 dup key': (err) => `Correo ${err.keyValue.email || ''} previamente registrado`,
});

AccountSchema.pre('save', async function preSave(this: AccountDocument, next) {
  if (this.isNew) {
    this.password = await hash(this.password, 10);

    const keychain = new NodeRSA({ b: 2048 });

    this.RSA.privateKey = keychain.exportKey('private');
    this.RSA.publicKey = keychain.exportKey('public');
  }

  next();
});
