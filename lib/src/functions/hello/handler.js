import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { connectToDatabase } from '@db/sequelize';
const hello = async (event) => {
    await connectToDatabase(true, true);
    return formatJSONResponse({
        message: `Hello ${event.body.name}, welcome to the exciting Serverless world GANG!!!`,
    });
};
export const main = middyfy(hello);
//# sourceMappingURL=handler.js.map