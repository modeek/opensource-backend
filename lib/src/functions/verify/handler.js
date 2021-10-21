import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { models } from '@db/sequelize';
const accountSid = 'ACac701a1aaf3df7179d0a79ce3f6050ac';
const authToken = 'f1a915839f135c78717def8b0024f381';
const client = require('twilio')(accountSid, authToken);
const verify = async (event) => {
    const { User } = models;
    return client.verify
        .services('VA860954434f47197003107832f5cfde67')
        .verificationChecks.create({ to: event.body.phoneNumber, code: event.body.code })
        .then(async (verification_check) => {
        return formatJSONResponse({
            status: verification_check.status,
            valid: verification_check.status === 'approved',
            phoneNumber: event.body.phoneNumber,
            hasAccount: (await User.findOne({
                where: {
                    phoneNumber: event.body.phoneNumber,
                },
            }))
                ? true
                : false,
        });
    })
        .catch(() => {
        return formatJSONResponse({
            status: false,
            valid: false,
            phoneNumber: false,
            hasAccount: false,
        });
    });
};
export const main = middyfy(verify);
//# sourceMappingURL=handler.js.map