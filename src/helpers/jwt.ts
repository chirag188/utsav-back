import _ from 'lodash'
import jwt from 'jsonwebtoken'
import { Logger } from '@config/logger'
import { JWTPayload } from '@interfaces/jwtPayload'

const _JWT_SECRET = 'EnverxJWT_SECRET'

export const generateToken = async (payload: JWTPayload) => {
	try {
		Logger.info('Genrate Token')
		return jwt.sign(payload, _JWT_SECRET, {
			expiresIn: '30d',
		})
	} catch (err) {
		Logger.error(err)
	}
}

export const verifyToken = async (token: string) => {
	try {
		Logger.info('Verify Token')
		return jwt.verify(token, _JWT_SECRET)
	} catch (err) {
		Logger.error(err)
		return { error: err }
	}
}
