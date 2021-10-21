import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import bye from '@functions/bye';
import login from '@functions/login';
import verify from '@functions/verify';
import signUp from '@functions/signUp';
import uploadID from '@functions/uploadID';
import validateId from '@functions/validateID';
import refreshToken from '@functions/refreshToken';
import submitOrder from '@functions/submitOrder';
import getOrderStatus from '@functions/getOrderStatus';
import updateOrderStatus from '@functions/updateOrderStatus';

const serverlessConfiguration: AWS = {
  org: 'sheesha',
  app: 'sheesha',
  service: 'backend',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceInclude: [
          'pg',
          'pg-hstore',
          'sequelize',
          'twilio',
          'sequelize-typescript',
          'reflect-metadata',
          'jsonwebtoken',
        ],
      },
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    stage: 'dev',
    region: 'us-east-1',

    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    hello,
    bye,
    login,
    verify,
    signUp,
    uploadID,
    validateId,
    refreshToken,
    submitOrder,
    getOrderStatus,
    updateOrderStatus,
  },
};

module.exports = serverlessConfiguration;
