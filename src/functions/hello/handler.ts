import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { connectToDatabase } from '@db/sequelize';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  await connectToDatabase(true, false);

  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world GANG!!!`,
  });
};

export const main = middyfy(hello);
