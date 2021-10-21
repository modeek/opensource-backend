/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { models } from '@db/sequelize';
import jwt from 'jsonwebtoken';

import schema from './schema';
import { User } from '@db/models/User';
import { AuthToken } from '@db/models/AuthToken';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'AKIAYJ3QPUML2FOEIM52',
  secretAccessKey: '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',
});

const accountSid = 'ACac701a1aaf3df7179d0a79ce3f6050ac';
const authToken = 'f1a915839f135c78717def8b0024f381';

const client = require('twilio')(accountSid, authToken);
const util = require('util');

const verify: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { User, VerificationRequest } = models;

  const token = event.headers.authtoken;
  let translatedToken: { user: User; token: AuthToken } | null;

  if (token) {
    try {
      translatedToken = await jwt.verify(token, 'SheeshaToken123');
    } catch {
      return formatJSONResponse({
        clearToken: true,
        success: false,
      });
    }
  }

  if (translatedToken) {
    if (new Date().getTime() > new Date(translatedToken.token.expiresAt).getTime()) {
      return formatJSONResponse({
        clearToken: true,
        success: false,
      });
    }

    const account = await User.findOne({
      where: {
        phoneNumber: translatedToken.user.phoneNumber,
      },
    });

    if (account) {
      const uploadID = uuidv4().replace(/-/g, '');

      // const buffer = Buffer.from(event.body.id, 'base64');

      const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        signatureVersion: 'v4',
      });

      // @ts-ignore
      const base64Data = new Buffer.from(event.body.id.replace(/^data:image\/\w+;base64,/, ''), 'base64');

      // @ts-ignore
      const type = event.body.id.split(';')[0].split('/')[1];

      return s3
        .putObject({
          Body: base64Data,
          Bucket: 'sheeshacdn',
          Key: uploadID,
          ContentEncoding: 'base64',
          ContentType: `image/${type}`,
        })
        .promise()
        .then(async () => {
          account.hasUploadedID = true;
          account.idKey = uploadID;
          await account.save();

          await VerificationRequest.create({
            userId: account.id,
            idKey: uploadID,
          });

          return formatJSONResponse({
            token: await jwt.sign({ user: account, token: translatedToken.token }, 'SheeshaToken123', {
              algorithm: 'HS512',
            }),
            success: true,
          });
        })
        .catch((error: any) => {
          console.log(error);
          return formatJSONResponse({
            success: false,
          });
        });
    } else {
      return formatJSONResponse({
        clearToken: true,
        success: false,
      });
    }
  }
};

export const main = middyfy(verify);
