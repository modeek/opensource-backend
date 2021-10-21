/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { models } from '@db/sequelize';
import jwt from 'jsonwebtoken';

import schema from './schema';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'AKIAYJ3QPUML2FOEIM52',
  secretAccessKey: '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',
});

// const accountSid = 'ACac701a1aaf3df7179d0a79ce3f6050ac';
// const authToken = 'f1a915839f135c78717def8b0024f381';

// const client = require('twilio')(accountSid, authToken);
// const util = require('util');

const updateOrderStatus: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { Order } = models;

  const order = await Order.findOne({
    where: {
      id: event.body.id,
    },
  });

  order.status = event.body.status;

  await order.save();

  return formatJSONResponse({
    success: true,
  });
};

export const main = middyfy(updateOrderStatus);
