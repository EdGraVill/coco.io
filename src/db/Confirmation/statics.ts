import { getRandomInt, staticsAdditor } from '@db/util';
import { createHash } from 'crypto';
import type { ConfirmationDocument, ConfirmationModel } from './model';

export const addAccountStatics = staticsAdditor<ConfirmationDocument, ConfirmationModel>({
  async addNew(payloadCheck, codeLength = 6, expiration = new Date(Date.now() + 15 * 60 * 1000)) {
    const code = await this.requestCode(codeLength);

    const Confirmation = new this({
      code,
      expiration,
      payloadCheck,
    });

    return Confirmation.save();
  },
  findByCode(code, projection, options) {
    return this.findOne({ code }, projection, options);
  },
  hashPayload(payload) {
    const hash = createHash('md5');

    if (typeof payload === 'object') {
      return hash.update(JSON.stringify(payload)).digest('hex');
    }

    return hash.update(payload.toString()).digest('hex');
  },
  async requestCode(codeLength) {
    const code = new Array(codeLength)
      .fill(0)
      .map(() => getRandomInt(0, 10))
      .join('');

    const Exist = await this.findByCode(code);

    if (!Exist) {
      return code;
    }

    return this.requestCode(codeLength);
  },
  async verify(code, payloadCheck) {
    const Confirmation = await this.findByCode(code);

    if (!Confirmation) {
      return false;
    }

    return Confirmation.payloadCheck === payloadCheck;
  },
});
