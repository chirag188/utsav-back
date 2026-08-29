import { Logger } from '@config/logger'
import messages from '@helpers/messages'
import { errorHandler } from '@helpers/responseHandlers'
import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '@helpers/jwt'

const authorize = async (req: Request, res: Response, next: NextFunction) => {
	Logger.info('Authorize URL')
	try {
		if (!req.headers?.authorization) {
			return errorHandler({
				res,
				statusCode: 401,
				err: messages.TOKEN_NOT_PROVIDED,
			})
		}

		const token = req?.headers?.authorization?.split(' ')[1]!

		const result: any = await verifyToken(token)
		req.user = result
		return next()
	} catch (error: any) {
		Logger.error(error)

		const errorMessage = error.response?.data.msg
		if (
			error?.response?.status === 401 ||
			['invalid signature', 'jwt expired'].includes(errorMessage)
		) {
			return errorHandler({
				res,
				err: messages.TOKEN_EXPIRED,
				statusCode: 401,
			})
		}

		return errorHandler({
			res,
			err: messages.INTERAL_AUTH_ERROR,
			statusCode: 403,
		})
	}
}

export default authorize
