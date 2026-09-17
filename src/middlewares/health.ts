import { Logger } from '@config/logger'
import { Request, Response } from 'express'

const health = (req: Request, res: Response) => {
	Logger.info(`Health check called from IP: ${req.ip}, URL: ${req.originalUrl}`)
	res.status(200).send('The route is healthy')
}

export default health
