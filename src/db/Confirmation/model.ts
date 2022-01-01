import { modelGetter } from '@db/util';
import type { Document, Model, QueryOptions } from 'mongoose';
import type { ConfirmationSchemaType } from './schema';
import { confirmationSchema } from './schema';
import { addAccountStatics } from './statics';

addAccountStatics(confirmationSchema);

export interface ConfirmationDocument extends Document, ConfirmationSchemaType {}

export interface ConfirmationModel extends Model<ConfirmationDocument> {
  addNew(payloadCheck: string, codeLength?: number, expiration?: Date): Promise<ConfirmationDocument>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findByCode(code: string, projection?: any, options?: QueryOptions): ReturnType<ConfirmationModel['findOne']>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hashPayload(payload: any): string;
  requestCode(codeLength: number): Promise<string>;
  verify(code: string, payloadCheck: string): Promise<boolean>;
}

export const confirmationModelName = 'Confirmation';

export const getConfirmationModel = modelGetter<ConfirmationDocument, ConfirmationModel>(
  confirmationModelName,
  confirmationSchema,
);
