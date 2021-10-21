import hello from '@functions/hello';
import bye from '@functions/bye';
import login from '@functions/login';
import verify from '@functions/verify';
const serverlessConfiguration = {
    org: 'sheesha',
    app: 'sheesha',
    service: 'backend',
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
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
    functions: { hello, bye, login, verify },
};
module.exports = serverlessConfiguration;
//# sourceMappingURL=serverless.js.map