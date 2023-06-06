import Config from '@config/config'
import { Logger } from '@config/logger'
import Axios from 'axios'
import crypto from 'crypto'
import FormData from 'form-data'

const SUMSUB_APP_TOKEN = Config.SUMSUB.APP_TOKEN
const SUMSUB_SECRET_KEY = Config.SUMSUB.SECRET_KEY
const SUMSUB_BASE_URL = Config.SUMSUB.BASE_URL

var config: any = {}
config.baseURL = SUMSUB_BASE_URL

function createSignature(config: any) {
	Logger.info('Creating a signature for the request...')

	var ts = Math.floor(Date.now() / 1000)
	const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY!)
	signature.update(ts + config.method.toUpperCase() + config.url)

	if (config.data instanceof FormData) {
		signature.update(config.data.getBuffer())
	} else if (config.data) {
		signature.update(config.data)
	}

	config.headers['X-App-Access-Ts'] = ts
	config.headers['X-App-Access-Sig'] = signature.digest('hex')

	return config
}

const createApplicant = (externalUserId: string, levelName: string) => {
	Logger.info('Creating an applicant...')

	var method = 'post'
	var url = '/resources/applicants?levelName=' + levelName
	var ts = Math.floor(Date.now() / 1000)

	var body = {
		externalUserId: externalUserId,
	}

	var headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-App-Token': SUMSUB_APP_TOKEN,
	}

	config.method = method
	config.url = url
	config.headers = headers
	config.data = JSON.stringify(body)

	return config
}

const getApplicantData = (applicantId: string) => {
	Logger.info('Getting the applicant Data...')

	var method = 'get'
	var url = `/resources/applicants/${applicantId}/one`

	var headers = {
		Accept: 'application/json',
		'X-App-Token': SUMSUB_APP_TOKEN,
	}

	config.method = method
	config.url = url
	config.headers = headers
	config.data = null

	return config
}
const resetApplicant = (applicantId: string) => {
	Logger.info('inside reset the applicant Data...')

	var method = 'post'
	var url = `/resources/applicants/${applicantId}/reset`

	var headers = {
		Accept: 'application/json',
		'X-App-Token': SUMSUB_APP_TOKEN,
	}

	config.method = method
	config.url = url
	config.headers = headers
	config.data = null

	return config
}
const resetSingleVerification = (applicantId: string, idDocSetType: string) => {
	Logger.info('inside restart Mobile Verification')

	var method = 'post'
	var url = `/resources/applicants/${applicantId}/resetStep/${idDocSetType}`

	var headers = {
		Accept: 'application/json',
		'X-App-Token': SUMSUB_APP_TOKEN,
	}

	config.method = method
	config.url = url
	config.headers = headers
	config.data = null

	return config
}
const createAccessToken = (externalUserId: string) => {
	Logger.info('Creating an access token for initializng SDK...')

	const level_name = Config.SUMSUB.LEVEL_NAME
	const ttl_in_secs = Config.SUMSUB.TTLINSECS
	const method = 'post'
	const url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttl_in_secs}&levelName=${level_name}`

	const headers = {
		Accept: 'application/json',
		'X-App-Token': SUMSUB_APP_TOKEN,
	}

	config.method = method
	config.url = url
	config.headers = headers
	config.data = null

	return config
}

export const sumsubHelper = async (option: string, payload: any) => {
	Logger.info('inside sumsub helper')
	try {
		const axios = Axios.create()
		const data = axios.interceptors.request.use(createSignature, function (error) {
			return Promise.reject(error)
		})
		switch (option) {
			case 'TOKEN': {
				const { userId } = payload
				const response = await axios(createAccessToken(userId))
					.then(function (response) {
						return response
					})
					.catch(function (error) {
						Logger.error('Error:\n', error.response)
						throw error
					})
				return response.data
			}
			case 'APPLICANT_DATA': {
				const { applicantId } = payload
				const response = await axios(getApplicantData(applicantId))
					.then(function (response) {
						return response
					})
					.catch(function (error) {
						Logger.error('Error:\n', error.response)
						throw error
					})
				return response.data
			}
			case 'RESET_APPLICANT': {
				const { applicantId } = payload
				const response = await axios(resetApplicant(applicantId))
					.then(function (response) {
						return response
					})
					.catch(function (error) {
						Logger.error('Error:\n', error.response)
						throw error
					})
				return response.data
			}
			case 'PHONE_CHANGE': {
				const { applicantId } = payload
				const response = await axios(resetSingleVerification(applicantId, 'PHONE_VERIFICATION'))
					.then(function (response) {
						return response
					})
					.catch(function (error) {
						Logger.error('Error:\n', error.response)
						throw error
					})
				return response.data
			}
			default:
				return false
		}
	} catch (error) {
		Logger.info(error)
		throw error
	}
}
