import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { models } from '@db/sequelize';
import jwt from 'jsonwebtoken';

import schema from './schema';
import { userInfo } from 'node:os';

const accountSid = 'ACac701a1aaf3df7179d0a79ce3f6050ac';
const authToken = 'f1a915839f135c78717def8b0024f381';

const client = require('twilio')(accountSid, authToken);

const verify: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  // client.verify.services.create({friendlyName: 'Verification Service'})
  //                     .then(service => console.log(service.sid));

  const { User, CreationToken, AuthToken } = models;

  return client.verify
    .services('VA860954434f47197003107832f5cfde67')
    .verificationChecks.create({ to: event.body.phoneNumber, code: event.body.code })
    .then(async (verification_check) => {
      console.log(verification_check);

      const account = await User.findOne({
        where: {
          phoneNumber: event.body.phoneNumber,
        },
      });

      let authToken;

      if (account) {
        authToken = await AuthToken.create({
          userId: account.id,
        });

        account.currentAuthTokenId = authToken.id;

        await account.save();
      }

      return formatJSONResponse({
        status: verification_check.status,
        valid: verification_check.status === 'approved',
        phoneNumber: event.body.phoneNumber,
        hasAccount: account ? true : false,
        token: account
          ? await jwt.sign({ user: account, token: authToken }, 'SheeshaToken123', {
              algorithm: 'HS512',
            })
          : (await CreationToken.create({ phoneNumber: event.body.phoneNumber })).token,
      });
    })

    .catch((e) => {
      console.error(e);
      return formatJSONResponse({
        status: false,
        valid: false,
        phoneNumber: false,
        hasAccount: false,
      });
    });
};

export const main = middyfy(verify);
