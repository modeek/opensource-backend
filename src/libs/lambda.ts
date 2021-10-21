/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

export const middyfy = (handler: any): any => {
  return middy(handler).use(middyJsonBodyParser());
};
