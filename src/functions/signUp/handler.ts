import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { models } from '@db/sequelize';
import jwt from 'jsonwebtoken';

import schema from './schema';

// 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
const stripe = require('stripe')(
  'sk_test_51IWoyGDkVpWDtdClKm7CnLBL8HMcHg5dtJmYcHLyJ8Fi2alI03EwiygDV6RuWD5rCsravo3BbamknRaAFInPuUxM00kaRLSVcj',
);

const signUp: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  // client.verify.services.create({friendlyName: 'Verification Service'})
  //                     .then(service => console.log(service.sid));

  const { User, CreationToken, AuthToken } = models;

  const token = await CreationToken.findOne({
    where: {
      token: event.body.token,
      used: false,
    },
  });

  if (!token) {
    return formatJSONResponse({
      success: false,
      reason: `There is no valid account creation token`,
      clearToken: true,
      token: null,
    });
  }

  const account = await User.findOne({
    where: {
      phoneNumber: token.phoneNumber,
    },
  });

  if (account) {
    token.used = true;

    return formatJSONResponse({
      success: false,
      reason: `There's already an account that exists with the number ending in ${token.phoneNumber.substring(
        token.phoneNumber.length - 4,
      )}`,
      clearToken: true,
      token: null,
    });
  } else {
    if (!event.body.acceptTerms) {
      return formatJSONResponse({
        success: false,
        reason: `You must accept the terms and conditions to continue!`,
        clearToken: false,
        token: null,
      });
    }
    let customer;

    try {
      customer = await stripe.customers.create({
        name: `${event.body.firstName} ${event.body.lastName}`,
        description: 'Sheesha Customer',
        phone: token.phoneNumber,
      });
    } catch {
      console.log('failed to create customer');
    }

    const newUser = await User.create({
      firstName: event.body.firstName,
      lastName: event.body.lastName,
      phoneNumber: token.phoneNumber,
      birthday: new Date(event.body.birthday),
      stripeId: (customer && customer.id) || '',
    });

    token.userId = newUser.id;

    await token.save();

    const authToken = await AuthToken.create({
      userId: newUser.id,
    });

    newUser.currentAuthTokenId = authToken.id;

    await newUser.save();

    return formatJSONResponse({
      success: true,
      reason: null,
      clearToken: true,
      token: jwt.sign({ user: newUser, token: authToken }, 'SheeshaToken123', {
        algorithm: 'HS512',
      }),
    });
  }
};

export const main = middyfy(signUp);
