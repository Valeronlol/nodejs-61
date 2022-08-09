const argon2 = require('argon2')
const DbMixin = require('../src/db/db_mixin')
const { passSalt } = require('../src/contasnts')

module.exports = {
    name: 'auth',
    dependencies: ['api'],
    mixins: [DbMixin],

    actions: {
        // "MOL-tms-auth.getCurrentUserProfile:10"
        // this.broker.cacher.clean("auth.getCurrentUserProfile:*")
        // this.broker.cacher.clean("auth.getCurrentUserProfile:10")
        getCurrentUserProfile: {
            // cache: true,
            handler(ctx) {
                return {
                    name: 'Valera',
                    id: 1,
                }
            }
        },
        createNewUser: {
            params: {
                login: { type: 'string', min: 2 },
                password: { type: 'string', min: 6 },
            },
            async handler(ctx) {
                const { login, password } = ctx.params
                const passwordHash = await this.createPasswordHash(password)
                const [user] = await this.metadata.db('users')
                    .insert({
                        name: login,
                        password_hash: passwordHash,
                    })
                    .returning(['id', 'name'])
                await this.broker.emit('userCreated', { id: user.id })
                return user
            }
        },
        login: {
            params: {
                login: { type: 'string', min: 2 },
                password: { type: 'string', min: 6 },
            },
            async handler(ctx) {
                const { login, password } = ctx.params
                const passwordHash = await this.createPasswordHash(password)
                // TODO
                // 1) find user and fetch user hash
                // 2) compare password hash and existing hash
                const token = 'TODO jwt token'
                return token
            }
        },
        getListOfUsers: {
            cache: {
                ttl: 30,
            },
            handler(ctx) {
                console.log(`CONSOLE: returning list of users`)
                return this.metadata.db('users').select('id', 'name')
            }
        },
    },

    methods: {
        createPasswordHash: (password) => {
            try {
                return argon2.hash(password, {
                    salt: Buffer.from(passSalt),
                })
            } catch (err) {
                console.error(err)
                throw err
            }
        }
    },

    events: {
        'userCreated': {
            handler(ctx) {
                console.log('User id:', ctx.params.id)
            }
        }
    },

    created() {

    },

    async started() {

    },

    async stopped() {

    }
}
