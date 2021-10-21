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
import * as AWS from 'aws-sdk';
import { Card } from '@db/models/Card';

AWS.config.update({
  accessKeyId: 'AKIAYJ3QPUML2FOEIM52',
  secretAccessKey: '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',
});

const accountSid = 'ACac701a1aaf3df7179d0a79ce3f6050ac';
const authToken = 'f1a915839f135c78717def8b0024f381';

const client = require('twilio')(accountSid, authToken);
const util = require('util');

// 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
const stripe = require('stripe')(
  'sk_test_51IWoyGDkVpWDtdClKm7CnLBL8HMcHg5dtJmYcHLyJ8Fi2alI03EwiygDV6RuWD5rCsravo3BbamknRaAFInPuUxM00kaRLSVcj',
);

const submitOrder: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { User, Card, Order } = models;

  console.log(event);

  return formatJSONResponse({
    order: await Order.findOne({
      where: {
        id: event.pathParameters.id,
      },
    }),
  });
};

const generateResponse = (intent: any): any => {
  // Generate a response based on the intent's status
  switch (intent.status) {
    case 'requires_action':
    case 'requires_source_action':
      // Card requires authentication
      return {
        success: false,
        requiresAction: true,
        clientSecret: intent.client_secret,
      };
    case 'requires_payment_method':
    case 'requires_source':
      // Card was not properly authenticated, suggest a new payment method
      return {
        success: false,
        error: 'Your card was declined, please provide a new payment method',
      };
    case 'succeeded':
      // Payment is complete, authentication not required
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log('💰 Payment received!');
      return {
        success: true,
        clientSecret: intent.client_secret,
      };
  }
};

export const main = middyfy(submitOrder);
