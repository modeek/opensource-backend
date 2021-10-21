import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { models } from '@db/sequelize';

const bye: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { User } = models;

  User.create({
    firstName: 'Moe1234',
    lastName: 'Adam5123',
    phoneNumber: '2673125877',
  });

  return formatJSONResponse({
    message: `Bye ${event.body.name}, welcome to the exciting Serverless world GANG!!!`,
    event,
  });
};

export const main = middyfy(bye);
