import axios from 'axios'

import Config from '@config/config'
import { Logger } from '@config/logger'
import messages from '@helpers/messages'
import { errorHandler } from '@helpers/responseHandlers'
import { NextFunction, Request, Response } from 'express'

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

		const result: any = await axios
			.get(Config.AUTH.VERIFY_TOKEN, {
				headers: {
					authorization: req.headers.authorization,
				},
			})
			.catch((err) => {
				throw err
			})

		const user = result.data?.data
		req.user = user
		return next()
	} catch (error: any) {
		Logger.error(error)

		const errorMessage = error.response.data.msg
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
