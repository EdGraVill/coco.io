import type { InterfaceToSchema, SchemaLayer } from '@db/types';
import { createSchema } from '@db/util';
import { Schema } from 'mongoose';

export type ConfirmationSchemaType = SchemaLayer<{
  code: string;
  expiration: Date;
  isCompleted: boolean;
  isExpired: boolean;
  payloadCheck: string;
}>;

export const confirmationSchemaDefinition: InterfaceToSchema<ConfirmationSchemaType> = {
  code: {
    index: true,
    required: true,
    type: Schema.Types.String,
    unique: true,
  },
  expiration: {
    required: true,
    type: Schema.Types.Date,
  },
  isCompleted: {
    default: false,
    required: true,
    type: Schema.Types.Boolean,
  },
  isExpired: {
    default: false,
    required: true,
    type: Schema.Types.Boolean,
  },
  payloadCheck: {
    required: true,
    type: Schema.Types.String,
  },
};

export const confirmationSchema = createSchema(confirmationSchemaDefinition);
