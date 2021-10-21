import { Order } from './models/Order';
import { Card } from '@db/models/Card';

import { Sequelize } from 'sequelize-typescript';
import { CreationToken } from './models/CreationToken';
import { AuthToken } from './models/AuthToken';
import { VerificationRequest } from './models/VerificationRequest';

import { User } from '@db/models/User';
import { Driver } from './models/Driver';

// import fs from 'fs';
// const rdsCa = fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem');

const connection = {
  isConnected: false,
};

const sequelize = new Sequelize({
  database: 'sheesha',
  username: 'postgres',
  password: 'Sheesha#420',
  dialect: 'postgres',
  host: 'sheesha-dev.cw9xdykh5cb3.us-east-1.rds.amazonaws.com',
  port: 5432,
  logging: false, //console.log,
  ssl: true,
  pool: { max: 5, idle: 30 },
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      // ca: [rdsCa],
    },
    connectTimeout: 60000,
  },
  // models: [__dirname + '/models/**/*.model.ts'],
  // modelMatch: (filename, member) => {
  //     return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  // },
});

sequelize.addModels([User, Order, CreationToken, AuthToken, VerificationRequest, Card, Driver]);

const models = { User, Order, CreationToken, AuthToken, VerificationRequest, Card, Driver };

const connectToDatabase = async (alter?: boolean, force?: boolean): Promise<Sequelize> => {
  if (connection.isConnected) {
    console.log('=> Using existing connection.');
    if (alter || force) {
      await sequelize.sync({ force, alter, logging: () => console.log });
    }
    return sequelize;
  } else {
    if (alter || force) {
      await sequelize.sync({ force, alter, logging: () => console.log });
    }

    await sequelize.authenticate();
    connection.isConnected = true;
    console.log('=> Created new Connection!');
    return sequelize;
  }
};

export { sequelize, connectToDatabase, models };
