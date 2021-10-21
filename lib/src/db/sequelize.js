import { Order } from './models/order.model';
import { User } from '@db/models/user.model';
import { Sequelize } from 'sequelize-typescript';
const fs = require('fs');
const rdsCa = fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem');
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
    logging: false,
    ssl: true,
    pool: { max: 5, idle: 30 },
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: [rdsCa],
        },
        connectTimeout: 60000,
    },
    models: [User, Order],
});
const models = { User, Order };
const connectToDatabase = async (alter, force) => {
    if (connection.isConnected) {
        console.log('=> Using existing connection.');
        return sequelize;
    }
    else {
        if (alter || force) {
            await sequelize.sync({ alter, force, logging: () => { } });
        }
        await sequelize.authenticate();
        connection.isConnected = true;
        console.log('=> Created new Connection!');
        return sequelize;
    }
};
export { sequelize, connectToDatabase, models };
//# sourceMappingURL=sequelize.js.map