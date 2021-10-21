import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { models } from '@db/sequelize';
const bye = async (event) => {
    const { User } = models;
    const user = User.create({
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
//# sourceMappingURL=handler.js.map