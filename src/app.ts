// Load Path Alias For Transpiled Code [Sync]
import path from 'path'
if (path.extname(__filename) === '.js') {
	require('module-alias/register')
}

import multer from 'multer'
import express, { ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import cors from 'cors'

import indexRouter from './components/index'

import { Logger } from '@config/logger'
import db from '@connections/db'

// import { run } from '@consumer/SNS'
import Config from '@config/config'
// import executeCrons from '@cron/echo.cron'
// import { createUserSupportService } from '@user/service'

const app = express()
const upload = multer()
const expressErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	Logger.error(err.stack)
	res.status(err.status).send(err.message)
}

app.use(
	express.json({
		verify: (req, _res, buf) => {
			req['rawBody'] = buf
		},
	})
)
app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(upload.none()) // Parse multipart/form-data payloads with no files

app.use('/api/v1', indexRouter)

app.use('/', (req, res) => {
	Logger.info('Inside 404 Error Route')
	res.status(404).send('404 Page Not Found!')
})

// Express Error Handler
app.use(expressErrorHandler)

db.sync({ alter: true }).then(() => {
	Logger.info('Database Connected')
	const hostName = '0.0.0.0'
	app.listen(parseInt(Config.PORT!), hostName, () => {
		Logger.info(`Server is running at ${Config.PORT}`)
		// createUserSupportService()
		// executeCrons()
		// run()
		Logger.info('All Consumer Services started!')
	})
})
