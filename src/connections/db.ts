import { Sequelize } from 'sequelize-typescript'
import user from '@user/user.model'
import Config from '@config/config'
import { Logger } from '../config/logger'
import SatsangProfile from '@user/SatsangProfile.model'
import SamparkVrund from '@user/SamparkVrund.model'
import Karykarm from '@user/karykarm.model'
import FollowUp from '@user/followUp.model'

const _database: string = Config.DB.DB_NAME!
// const _dialect: string = Config.DB.DB_DIALECT!
const _username: string = Config.DB.DB_USERNAME!
const _password: string = Config.DB.DB_PASSWORD!
// const _host: string = Config.DB.DB_HOST!
// const _port: string = Config.DB.DB_PORT!

const db = new Sequelize(
	"postgres://utsavdb:QALaoTZ2dyrP5oYTob9XCoGt4vimEOn0@dpg-csck2il6l47c739br340-a.oregon-postgres.render.com/utsavdb_nsc7?sslmode=no-verify",
	{
		storage: ':memory:',
		logging: (msg) => Logger.info(msg),
		models: [user, SatsangProfile, SamparkVrund, Karykarm, FollowUp],
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
	}
)

// const db = new Sequelize(
// 	{
// 		database:_database,
// 		dialect:"postgres",
// 		username: _username,
// 		password:_password,
// 		port: 5433,
// 		storage: ':memory:',
// 		logging: (msg) => Logger.info(msg),
// 		models: [user, SatsangProfile, SamparkVrund, Karykarm, FollowUp],
// 		define: {
// 			freezeTableName: true,
// 		},
// 		retry: {
// 			max: Infinity,
// 			match: [
// 				/ConnectionError/,
// 				/SequelizeConnectionError/,
// 				/SequelizeConnectionRefusedError/,
// 				/SequelizeHostNotFoundError/,
// 				/SequelizeHostNotReachableError/,
// 				/SequelizeInvalidConnectionError/,
// 				/SequelizeConnectionTimedOutError/,
// 				/SequelizeConnectionAcquireTimeoutError/,
// 				/Connection terminated unexpectedly/,
// 			],
// 		},
// 	}
// )

export default db
