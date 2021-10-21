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

  const token = event.headers.authtoken || event.headers.authToken;
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

    let account = await User.findOne({
      where: {
        phoneNumber: translatedToken.user.phoneNumber,
      },
    });

    let intent;
    let cardToUse: Card;

    if (account) {
      // make sure that he has customer id
      if (!account.stripeId) {
        let customer;

        try {
          customer = await stripe.customers.create({
            name: `${account.firstName} ${account.lastName}`,
            description: 'Sheesha Customer',
            phone: account.phoneNumber,
          });
        } catch {
          console.log('failed to create customer');
        }
        account.stripeId = customer.id;
        await account.save();
      }

      if (event.body.paymentIntentId) {
        const order = await Order.findOne({
          where: {
            paymentIntentId: event.body.paymentIntentId,
          },
        });
        if (order) {
          try {
            intent = await stripe.paymentIntents.confirm(order.paymentIntentId);
          } catch (e: any) {
            return formatJSONResponse({
              token: await jwt.sign({ user: account, token: translatedToken.token }, 'SheeshaToken123', {
                algorithm: 'HS512',
              }),
              success: false,
              orderId: order.id,
              error: e.message,
            });
          }

          const response = generateResponse(intent);

          if (response.success) {
            order.paid = true;
            await order.save();
            return formatJSONResponse({
              token: await jwt.sign({ user: account, token: translatedToken.token }, 'SheeshaToken123', {
                algorithm: 'HS512',
              }),
              success: true,
              orderId: order.id,
              ...response,
            });
          } else {
            return formatJSONResponse({
              token: await jwt.sign({ user: account, token: translatedToken.token }, 'SheeshaToken123', {
                algorithm: 'HS512',
              }),
              success: false,
              orderId: order.id,
              ...response,
            });
          }
        } else {
          return formatJSONResponse({
            token: await jwt.sign({ user: account, token: translatedToken.token }, 'SheeshaToken123', {
              algorithm: 'HS512',
            }),
            success: false,
            error: 'Cannot find your order!',
          });
        }
      } else {
        await Card.update(
          {
            currentUserId: null,
          },
          { where: { currentUserId: account.id } },
        );

        const card = await Card.findOne({
          where: {
            paymentId: event.body.card.id,
          },
        });

        if (card && card.paymentId !== account.card.paymentId) {
          card.currentUserId = account.id;
          await card.save();
          cardToUse = card;
        } else if (card === null) {
          console.log('called to make new card');
          cardToUse = await Card.create({
            paymentId: event.body.card.id,
            brand: event.body.card.brand,
            last4: event.body.card.last4,
            exp_year: event.body.card.exp_year,
            exp_month: event.body.card.exp_month,
            funding: event.body.card.funding,
            name: event.body.card.name,
            userId: account.id,
            currentUserId: account.id,
          });
        } else {
          cardToUse = card;
          card.currentUserId = account.id;
          await card.save();
        }

        account = await User.findOne({
          where: {
            phoneNumber: translatedToken.user.phoneNumber,
          },
        });

        const order = await Order.create({
          customerId: account.id,
          cardId: cardToUse.id,
          deliverAt: new Date(event.body.info.dropOffTime),
          driverTip: event.body.info.driverTip,
          notes: event.body.info.notes,
          address: event.body.info.address,
          contactNumber: event.body.info.contactNumber,

          //@ts-ignore
          items: event.body.items,
        });

        console.log(cardToUse.paymentId);

        try {
          intent = await stripe.paymentIntents.create({
            amount: Math.floor(order.totalPrice * 100),
            currency: 'usd',
            payment_method: cardToUse.paymentId,
            confirmation_method: 'manual',
            // charge now
            confirm: true,
            use_stripe_sdk: false,
            return_url: `http://localhost:3333/checkout`,
            setup_future_usage: 'on_session',
            customer: account.stripeId,
          });
        } catch (e: any) {
          return formatJSONResponse({
            token: await jwt.sign({ user: await account.reload(), token: translatedToken.token }, 'SheeshaToken123', {
              algorithm: 'HS512',
            }),
            success: false,
            error: e.message,
          });
        }

        console.log(intent.payment_method);

        order.paymentIntentId = intent.id;
        await order.save();

        const response = generateResponse(intent);

        if (response.success) {
          order.paid = true;
          await order.save();

          account = await User.findOne({
            where: {
              phoneNumber: translatedToken.user.phoneNumber,
            },
          });

          return formatJSONResponse({
            token: await jwt.sign({ user: await account.reload(), token: translatedToken.token }, 'SheeshaToken123', {
              algorithm: 'HS512',
            }),
            success: true,
            orderId: order.id,
            ...response,
          });
        } else {
          account = await User.findOne({
            where: {
              phoneNumber: translatedToken.user.phoneNumber,
            },
          });

          return formatJSONResponse({
            token: await jwt.sign({ user: await account.reload(), token: translatedToken.token }, 'SheeshaToken123', {
              algorithm: 'HS512',
            }),
            success: false,
            orderId: order.id,
            ...response,
          });
        }
      }
    } else {
    }
  }
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
