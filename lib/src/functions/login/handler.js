import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const accountSid = 'ACac701a1aaf3df7179d0a79ce3f6050ac';
const authToken = 'f1a915839f135c78717def8b0024f381';
const client = require('twilio')(accountSid, authToken);
const login = async (event) => {
    return client.verify
        .services('VA860954434f47197003107832f5cfde67')
        .verifications.create({ to: event.body.phoneNumber, channel: 'sms' })
        .then((verification) => {
        return formatJSONResponse({
            status: verification.status,
            attempts: verification.sendCodeAttempts.length,
            phoneNumber: verification.to
        });
    });
};
export const main = middyfy(login);
//# sourceMappingURL=handler.js.map