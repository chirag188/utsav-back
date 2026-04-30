import cron from 'node-cron'
import { Logger } from '@config/logger'

const executeCrons = async () => {
	cron.schedule('*/13 * * * *', async () => {
		const thisDate = new Date()
		Logger.info(`Cron Job is running every 13 minutes (activation window) ${thisDate}`)
		// TODO: add business logic to activate echo subscription for users
	})

	cron.schedule('6,19,32,45,58 * * * *', async () => {
		const thisDate = new Date()
		Logger.info(`Cron Job is running every 13 minutes (deactivation window) ${thisDate}`)
		// TODO: add business logic to deactivate echo subscription for users
	})
}

export default executeCrons
