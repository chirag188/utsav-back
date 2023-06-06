import { Sequelize } from 'sequelize-typescript'
import _admin from '@dummy/admin/admin.model'
import user from '@user/user.model'
import Config from '@config/config'
import { Logger } from '../config/logger'
import notification from '@notification/notification.model'
import Device from '@user/device.model'
import Countries from '@user/countries.model'
import SatsangProfile from '@user/SatsangProfile.model'
import SamparkVrund from '@user/SamparkVrund.model'

const _database: string = Config.DB.DB_NAME!
// const _dialect: string = Config.DB.DB_DIALECT!
const _username: string = Config.DB.DB_USERNAME!
const _password: string = Config.DB.DB_PASSWORD!
const _host: string = Config.DB.DB_HOST!
const _port: string = Config.DB.DB_PORT!

const db = new Sequelize({
	database: _database,
	dialect: 'postgres',
	username: _username,
	password: _password,
	host: _host, // default connect to localhost
	port: Number(_port),
	storage: ':memory:',
	logging: (msg) => Logger.info(msg),
	models: [_admin, user, notification, SatsangProfile, SamparkVrund, Device, Countries],
	define: {
		freezeTableName: true,
	},
	retry: {
		max: Infinity,
		match: [
			/ConnectionError/,
			/SequelizeConnectionError/,
			/SequelizeConnectionRefusedError/,
			/SequelizeHostNotFoundError/,
			/SequelizeHostNotReachableError/,
			/SequelizeInvalidConnectionError/,
			/SequelizeConnectionTimedOutError/,
			/SequelizeConnectionAcquireTimeoutError/,
			/Connection terminated unexpectedly/,
		],
	},
})

export default db
