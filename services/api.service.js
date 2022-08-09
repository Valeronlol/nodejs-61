const ApiGateway = require('moleculer-web')

module.exports = {
    name: 'api',
    mixins: [ApiGateway],
    settings: {
        port: process.env.PORT || 3000,
        ip: '0.0.0.0',
        routes: [
            {
                path: '/api',
                aliases: {
                    'GET user': 'auth.getListOfUsers',
                    'POST user': 'auth.createNewUser',
                    'POST user/login': 'auth.login',
                    'GET profile': 'auth.getCurrentUserProfile',
                },
                bodyParsers: { json: true },
                mappingPolicy: 'restrict',
                logging: true,
                authentication: true,
                authorization: true,
            },
        ],

        log4XXResponses: false,
        logRequestParams: null,
        logResponseData: null,
    },

    methods: {
        async authenticate(ctx, route, req) {
            return this.broker.call('auth.authenticate', req.params)
        },
        async authorize(ctx, route, req) {
            return { id: 1, name: 'John Doe' }
        },
    }
}
