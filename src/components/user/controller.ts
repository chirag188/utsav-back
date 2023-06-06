import { v4 as uuid } from 'uuid'
import { SamparkVrundInterface, UserInterface, satsangProfileInterface } from '@interfaces/user'
import { Request, Response } from 'express'
// import jwt from 'jsonwebtoken'
import { Logger } from '@config/logger'
import { registerRequest, satsangProfileRequest } from '@user/validator'
import { errorHandler, responseHandler } from '@helpers/responseHandlers'
import { hash } from 'bcrypt'
import {
	createSamparkVrund,
	createSatsangProfile,
	createUser,
	getAllSamparkVrund,
	getUserService,
	updateSatsangProfile,
	updateUser,
} from '@user/service'
import Messages from '@helpers/messages'
// import { sendEmail, sendMultipleEmails } from '@helpers/email'
// import { sendSMS } from '@helpers/sms'
// import axios from 'axios'
// import Config from '@config/config'
// import { subscribeTopic, unSubscribeTopic } from '@notification/service'
// import { sendNotification, unsubscribeFromTopic } from '@helpers/fcm'
// import { authenticatorGenerator, validateAuthCode } from '@helpers/authenticator'
// import moment from 'moment'
// import { caxtonOnboardInterface, kybPayloadInterface } from '@interfaces/caxton'
// import { encryptCaxtonPassword, randomStringGen } from '@helpers/encryptionHelper'
// import deviceDetector from '@helpers/deviceDetector'

export const createUserApi = async (req: Request, res: Response) => {
	Logger.info('Inside user register controller')

	try {
		const {
			firstname,
			middlename,
			lastname,
			mobileNumber,
			mobileUser,
			houseNumber,
			socName,
			nearBy,
			area,
			married,
			education,
			mandal,
			email,
			seva,
			sevaIntrest,
			password,
			userType,
			profilePic,
			DOB,
			addressLine1,
			gender,
			id,
		}: {
			firstname: string
			middlename: string
			lastname: string
			mobileNumber: number
			mobileUser: string
			houseNumber: string
			socName: string
			nearBy: string
			area: string
			married: boolean
			education: string
			mandal: string
			email: string
			seva: string
			sevaIntrest: string
			password: string
			userType: string
			profilePic: string
			DOB: Date
			addressLine1: string
			gender: string
			id: string
		} = req.body

		const userObject: UserInterface = {
			id: id ? id : uuid(),
			firstname,
			middlename,
			lastname,
			mobileNumber,
			mobileUser,
			houseNumber,
			socName,
			nearBy,
			area,
			married,
			education,
			mandal,
			email,
			seva,
			sevaIntrest,
			password,
			userType: userType === 'Karykar' ? 'Karykar' : 'Yuvak',
			profilePic,
			DOB,
			addressLine1,
			gender,
		}

		const validator = await registerRequest(userObject)

		if (validator.error) {
			return errorHandler({ res, err: validator.message })
		}

		userObject.password = await hash(password, 10)

		if (id) {
			const user = await updateUser(userObject)
			if (user === false) {
				return errorHandler({
					res,
					statusCode: 409,
					err: Messages.NOT_EMAIL_EXIST,
				})
			}
			return responseHandler({
				res,
				status: 200,
				msg: Messages.YUVAK_UPDATED_SUCCESS,
				data: { user },
			})
		} else {
			const user = await createUser(userObject)
			if (user === false) {
				return errorHandler({
					res,
					statusCode: 409,
					err: Messages.EMAIL_EXIST,
				})
			}
			if (user) {
				await createSatsangProfile({
					id: uuid(),
					userId: userObject.id,
					yuvakProfile: '',
					nityaPuja: false,
					nityaPujaYear: 0,
					tilakChandlo: false,
					tilakChandloYear: 0,
					satsangi: false,
					satsangiYear: 0,
					athvadikSabha: false,
					athvadikSabhaYear: 0,
					raviSabha: false,
					raviSabhaYear: 0,
					gharSatsang: false,
					gharSatsangYear: 0,
					ssp: false,
					sspStage: '',
					ekadashi: false,
					ekadashiYear: 0,
					niymitVanchan: false,
					niymitVanchanYear: 0,
				})
			}
			return responseHandler({
				res,
				status: 200,
				msg: Messages.YUVAK_CREATED_SUCCESS,
				data: { user },
			})
		}
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const createSatsangProfileApi = async (req: Request, res: Response) => {
	Logger.info('Inside user register controller')

	try {
		const {
			id,
			yuvakProfile,
			nityaPuja,
			nityaPujaYear,
			tilakChandlo,
			tilakChandloYear,
			satsangi,
			satsangiYear,
			athvadikSabha,
			athvadikSabhaYear,
			raviSabha,
			raviSabhaYear,
			gharSatsang,
			gharSatsangYear,
			ssp,
			sspStage,
			ekadashi,
			ekadashiYear,
			niymitVanchan,
			niymitVanchanYear,
			userId,
		}: {
			id: string
			yuvakProfile: string
			nityaPuja: boolean
			nityaPujaYear: number
			tilakChandlo: boolean
			tilakChandloYear: number
			satsangi: boolean
			satsangiYear: number
			athvadikSabha: boolean
			athvadikSabhaYear: number
			raviSabha: boolean
			raviSabhaYear: number
			gharSatsang: boolean
			gharSatsangYear: number
			ssp: boolean
			sspStage: string
			ekadashi: boolean
			ekadashiYear: number
			niymitVanchan: boolean
			niymitVanchanYear: number
			userId: string
		} = req.body

		const satsangProfileObject: satsangProfileInterface = {
			id: id ? id : uuid(),
			yuvakProfile,
			nityaPuja,
			nityaPujaYear,
			tilakChandlo,
			tilakChandloYear,
			satsangi,
			satsangiYear,
			athvadikSabha,
			athvadikSabhaYear,
			raviSabha,
			raviSabhaYear,
			gharSatsang,
			gharSatsangYear,
			ssp,
			sspStage,
			ekadashi,
			ekadashiYear,
			niymitVanchan,
			niymitVanchanYear,
			userId,
		}

		const validator = await satsangProfileRequest({ id, userId })

		if (validator.error) {
			return errorHandler({ res, err: validator.message })
		}

		if (id) {
			const satsangProfile = await updateSatsangProfile(satsangProfileObject)
			return responseHandler({
				res,
				status: 200,
				msg: Messages.YUVAK_SATSANG_PROFILE_SUCCESS,
				data: { satsangProfile },
			})
		}
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const createSamparkVrundApi = async (req: Request, res: Response) => {
	Logger.info('Inside SamparkVrund controller')

	try {
		const {
			karykar1profileId,
			karykar2profileId,
			yuvaks,
		}: {
			karykar1profileId: string
			karykar2profileId: string
			yuvaks: string[]
		} = req.body

		const samparkVrundObject: SamparkVrundInterface = {
			karykar1profileId,
			karykar2profileId,
			yuvaks,
		}

		const karykar1 = await getUserService({ id: karykar1profileId })
		if (karykar1 === null) {
			return errorHandler({
				res,
				statusCode: 400,
				err: Messages.NOT_EMAIL_EXIST,
			})
		}

		// const validator = await registerRequest(samparkVrundObject)

		// if (validator.error) {
		// 	return errorHandler({ res, err: validator.message })
		// }

		// if (id) {
		// 	const user = await updateUser(samparkVrundObject)
		// 	if (user === false) {
		// 		return errorHandler({
		// 			res,
		// 			statusCode: 409,
		// 			err: Messages.NOT_EMAIL_EXIST,
		// 		})
		// 	}
		// 	return responseHandler({
		// 		res,
		// 		status: 200,
		// 		msg: Messages.YUVAK_UPDATED_SUCCESS,
		// 		data: { user },
		// 	})
		// } else {
		const samparkVrund = await createSamparkVrund(samparkVrundObject)
		if (samparkVrund === false) {
			return errorHandler({
				res,
				statusCode: 409,
				err: Messages.EMAIL_EXIST,
			})
		}
		return responseHandler({
			res,
			status: 200,
			msg: Messages.YUVAK_CREATED_SUCCESS,
			data: { samparkVrund },
		})
		// }
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

// export const login = async (req: Request, res: Response) => {
// 	try {
// 		Logger.info('Inside Login controller')
// 		const data: { email: string; password: string } = req.body

// 		const { error, message } = await loginValidation(data)
// 		if (error) {
// 			return errorHandler({ res, statusCode: 501, err: message })
// 		}

// 		const user = await getUserService({ email: data.email })
// 		if (user === null) {
// 			return errorHandler({
// 				res,
// 				err: Messages.USER_NOT_FOUND,
// 				statusCode: 502,
// 			})
// 		}
// 		const resData: any = {
// 			mobileNumber: user.mobileNumber,
// 			countryCode: user.countryCode,
// 			email: user.email,
// 			loginAttempt: user.loginAttempt,
// 			loginBlockedTime: user.loginBlockedTime,
// 			otplimit: user.otpLimit,
// 			otpBlockTime: user.otpBlockTime,
// 			isOTPBlocked: user.isOTPBlocked,
// 			isLoginBlocked: user.isLoginBlocked,
// 		}
// 		const correctUser = await verifyPassword(data.password, user.password)

// 		if (!correctUser) {
// 			user!.decrement('loginAttempt')
// 			resData.loginAttempt -= 1
// 			await user.save()
// 			return errorHandler({
// 				res,
// 				err: Messages.INCORRECT_PASSWORD,
// 				statusCode: 502,
// 				data: resData,
// 			})
// 		}

// 		if (user!.userType === 'INVESTOR' || 'PROJECT_DEVELOPER') {
// 			// 2FA code
// 			const otp = Math.floor(100000 + Math.random() * 900000)

// 			const emailPayload = {
// 				data: otp.toString(),
// 				email: user!.email,
// 			}

// 			const emailSent = await sendEmail(emailPayload, 'sendVerification')

// 			if (emailSent?.error) {
// 				resData.error = emailSent?.error
// 				return errorHandler({
// 					res,
// 					statusCode: 400,
// 					err: Messages.OTP_SENT_EMAIL_FAILED,
// 					data: resData,
// 				})
// 			}

// 			await saveUserOTP(user.mobileNumber, user.countryCode, user.email, otp)
// 			resData.otplimit -= 1
// 			return responseHandler({ res, status: 200, msg: Messages.OTP_SENT_EMAIL, data: resData })
// 		} else {
// 			return errorHandler({
// 				res,
// 				err: Messages.ACCOUNT_TYPE_ERROR,
// 				statusCode: 502,
// 			})
// 		}
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

// export const verifyLogin = async (req: Request, res: Response) => {
// 	try {
// 		Logger.info('Inside Verify login controller')
// 		const {
// 			countryCode,
// 			mobileNumber,
// 			otpCode,
// 			email,
// 			fcmToken,
// 		}: {
// 			countryCode: string
// 			mobileNumber: number
// 			otpCode: number
// 			email: string
// 			fcmToken: string
// 		} = req.body

// 		const { error, message } = await verifyLoginValidation({
// 			countryCode,
// 			mobileNumber,
// 			otp: otpCode,
// 			email,
// 			fcmToken,
// 		})

// 		if (error) {
// 			return errorHandler({ res, statusCode: 501, err: message })
// 		}
// 		const user = await getUserService({ email })
// 		if (user === null) {
// 			return errorHandler({
// 				res,
// 				err: Messages.USER_NOT_FOUND,
// 				statusCode: 502,
// 			})
// 		}

// 		if (user.incorrectOtpAttempt === 0) {
// 			return errorHandler({
// 				res,
// 				err: Messages.OTP_EXPIRED,
// 				statusCode: 502,
// 			})
// 		}

// 		if (user!.otpCode !== otpCode) {
// 			user!.decrement('incorrectOtpAttempt')
// 			await user.save()
// 			return errorHandler({
// 				res,
// 				err: Messages.INCORRECT_OTP,
// 				statusCode: 502,
// 				data: {
// 					remainingOtpAttempt: user.incorrectOtpAttempt - 1,
// 				},
// 			})
// 		}
// 		if (user!.otpExpire <= new Date()) {
// 			return errorHandler({
// 				res,
// 				err: Messages.OTP_EXPIRED,
// 				statusCode: 502,
// 			})
// 		}

// 		let response = {
// 			id: user!.id,
// 			email: user!.email,
// 			accountType: user!.accountType,
// 			name: user!.entityType === 'COMPANY' ? user!.companyName : user!.name,
// 			userType: user!.userType,
// 		}
// 		const tokenResponse = (await axios
// 			.post(`${Config.SERVICES.AUTH}/api/v1/auth/generateToken`, response)
// 			.catch((err) => {
// 				return errorHandler({
// 					res,
// 					err: err,
// 					statusCode: 502,
// 				})
// 			}))!
// 		const token: string = tokenResponse.data.data.token
// 		if (fcmToken !== undefined || fcmToken !== '') {
// 			await subscribeTopic(fcmToken, user.id, `user-${user.id}`, token)

// 			if (user.isEchoSubscribed === true) {
// 				await subscribeTopic(fcmToken, user.id, 'echo-users', token)
// 			}
// 		}

// 		if (!user.emailVerified) {
// 			await axios
// 				.post(
// 					`${Config.NOTIFICATION.SEND}/${user.id}`,
// 					{
// 						title: 'Welcome to EnverX',
// 						body: `Welcome to EnverX. Complete your verification to ${
// 							user.userType === 'INVESTOR' ? 'Start Investing' : 'Create Project'
// 						}`,
// 						topic: `user-${user.id}`,
// 					},
// 					{
// 						headers: {
// 							authorization: `Bearer ${token}`,
// 						},
// 					}
// 				)
// 				.catch((err) => {
// 					Logger.error(err)
// 				})
// 		}
// 		user.emailVerified = true
// 		user.loginAttempt = 5
// 		user.isLoginBlocked = false
// 		user.loginBlockedTime = new Date()
// 		await user.save()
// 		await updateOTPService(null, email)
// 		return responseHandler({
// 			res,
// 			data: { email, token, userType: user!.userType, entityType: user!.entityType },
// 			msg: Messages.LOGIN_SUCCESS,
// 		})
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

export const getAllSamparkVrundAPI = async (req: Request, res: Response) => {
	try {
		Logger.info('inside get user controller')
		// const { userId } = req.params
		// const { id } = req.user
		const user = await getAllSamparkVrund({})
		if (user === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}

		// const data = {
		// 	companyName: user.companyName,
		// 	companyRegistrationNumber: user.companyRegistrationNumber,
		// 	companyWebsite: user.companyWebsite,
		// 	email: user.email,
		// 	country: user.country,
		// 	state: user.state,
		// 	postalCode: user.postalCode,
		// 	mobileNumber: user.mobileNumber,
		// 	profilePic: user.profilePic,
		// 	mobileNoVerified: user.mobileNoVerified,
		// 	kybStatus: user.kybStatus,
		// 	agreementSigned: user.agreementSigned,
		// 	userType: user.userType,
		// 	blockchainWalletAddress: user.blockchainWalletAddress,
		// 	agreementSentByAdmin: user.agreementSentByAdmin,
		// 	ERTCADocSigned: user.ERTCADocSigned,
		// 	userAgreement: user.userAgreement,
		// 	kybAttempt: user.kybAttempt,
		// 	ERTCADocID: user.ERTCADocID,
		// 	agreementDocId: user.agreementDocId,
		// 	countryCode: user.countryCode,
		// }

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: user })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

// export const getUserByAuth = async (req: Request, res: Response) => {
// 	try {
// 		Logger.info('inside get user controller')
// 		const { id } = req.user
// 		const user = await getUserService({ id })
// 		if (user === null) {
// 			return errorHandler({
// 				res,
// 				err: Messages.USER_NOT_FOUND,
// 				statusCode: 502,
// 			})
// 		}

// 		const data = {
// 			companyName: user.companyName,
// 			companyRegistrationNumber: user.companyRegistrationNumber,
// 			companyWebsite: user.companyWebsite,
// 			email: user.email,
// 			country: user.country,
// 			state: user.state,
// 			postalCode: user.postalCode,
// 			mobileNumber: user.mobileNumber,
// 			profilePic: user.profilePic,
// 			mobileNoVerified: user.mobileNoVerified,
// 			userType: user.userType,
// 			isEchoSubscribed: user.isEchoSubscribed,
// 			id: user.id,
// 			blockchainWalletAddress: user.blockchainWalletAddress,
// 			caxtonUserId: user.caxtonUserId,
// 			twoFAStatus: user.twoFAStatus,
// 			twoFAType: user.twoFAType,
// 			kybStatus: user.kybStatus,
// 			agreementSigned: user.agreementSigned,
// 			agreementSentByAdmin: user.agreementSentByAdmin,
// 			userAgreement: user.userAgreement,
// 			kybAttempt: user.kybAttempt,
// 			countryCode: user.countryCode,
// 			ERTCADocSigned: user.ERTCADocSigned,
// 		}

// 		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data })
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

// export const getAllUser = async (req: Request, res: Response) => {
// 	Logger.info('Inside Get all user controller')
// 	try {
// 		const {
// 			offset,
// 			limit,
// 			search,
// 			orderBy,
// 			orderType,
// 			userType,
// 			kybStatus,
// 			country,
// 			userStatus,
// 			entityType,
// 		} = req.query
// 		const strOffset = offset ? offset.toString() : '0'
// 		const strLimit = limit ? limit.toString() : '10'
// 		const searchText = search ? search.toString() : ''
// 		const strorderBy = orderBy ? orderBy.toString() : 'createdAt'
// 		const strorderType = orderType ? orderType.toString() : 'DESC'
// 		const usertype = userType ? userType.toString() : ''
// 		const kybstatus = kybStatus ? kybStatus.toString() : ''
// 		const Country = country ? country.toString() : ''
// 		const userstatus = userStatus ? userStatus.toString() : ''
// 		const entitytype = entityType ? entityType.toString() : ''

// 		const result = await getAllUserService(
// 			parseInt(strOffset!),
// 			parseInt(strLimit!),
// 			searchText,
// 			strorderBy,
// 			strorderType,
// 			usertype,
// 			kybstatus,
// 			Country,
// 			userstatus,
// 			entitytype
// 		)
// 		return responseHandler({ res, data: result, msg: Messages.USER_LIST_SUCCESS })
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

// export const updateUser = async (req: Request, res: Response, next: any) => {
// 	Logger.info('Inside update User controller')
// 	try {
// 		const { option }: { option: string } = req.body

// 		switch (option) {
// 			case 'profile': {
// 				const {
// 					companyName,
// 					companyRegistrationNumber,
// 					companyWebsite,
// 					country,
// 					state,
// 					postalCode,
// 					name,
// 					DOB,
// 					profilePic,
// 					lastLogout,
// 					fcmToken,
// 					addressLine1,
// 					addressLine2,
// 					firstLogin,
// 				}: {
// 					companyName: string
// 					companyRegistrationNumber: string
// 					companyWebsite: string
// 					country: string
// 					state: string
// 					postalCode: number
// 					name: string
// 					DOB: Date
// 					profilePic: string
// 					lastLogout: Date
// 					fcmToken: string
// 					addressLine1: string
// 					addressLine2: string
// 					firstLogin: boolean
// 				} = req.body
// 				const { id } = req.user
// 				const user = await getUserService({ id })
// 				if (user === null) {
// 					return errorHandler({
// 						res,
// 						err: Messages.USER_NOT_FOUND,
// 						statusCode: 502,
// 					})
// 				}
// 				const validator = await updateUserValidation({
// 					companyName,
// 					companyRegistrationNumber,
// 					companyWebsite,
// 					country,
// 					state,
// 					postalCode,
// 					name,
// 					DOB,
// 					profilePic,
// 					lastLogout,
// 					fcmToken,
// 					addressLine1,
// 					addressLine2,
// 					firstLogin,
// 				})

// 				if (validator.error) {
// 					return errorHandler({ res, err: validator.message })
// 				}
// 				const payload: Partial<UserInterface> = {
// 					id: user.id,
// 					email: user.email,
// 					mobileNumber: user.mobileNumber,
// 					userType: user.userType === 'INVESTOR' ? 'INVESTOR' : 'PROJECT_DEVELOPER',
// 					entityType: user.entityType === 'COMPANY' ? 'COMPANY' : 'INDIVIDUAL',
// 					companyName,
// 					companyRegistrationNumber,
// 					companyWebsite,
// 					country,
// 					state,
// 					postalCode,
// 					name,
// 					DOB,
// 					profilePic,
// 					lastLogout,
// 					addressLine1,
// 					addressLine2,
// 					firstLogin,
// 				}
// 				const result = await updateUserService(payload, id)

// 				if (result === null) {
// 					return errorHandler({ res, statusCode: 500, err: Messages.USER_UPDATE_FAILED })
// 				}
// 				if (fcmToken) {
// 					await unSubscribeTopic(fcmToken, user.id, `user-${user.id}`, req.headers.authorization!)
// 					if (user.isEchoSubscribed === true)
// 						await unSubscribeTopic(fcmToken, user.id, `echo-users`, req.headers.authorization!)
// 				}

// 				return responseHandler({ res, msg: Messages.USER_UPDATE_SUCCESS })
// 			}
// 			case 'password': {
// 				const { oldPassword, newPassword }: { oldPassword: string; newPassword: string } = req.body
// 				const { id } = req.user
// 				const validator = await changePasswordValidation({ oldPassword, newPassword })
// 				if (validator.error) {
// 					return errorHandler({ res, err: validator.message })
// 				}
// 				const user = await getUserService({ id })
// 				if (user === null) {
// 					return errorHandler({
// 						res,
// 						err: Messages.USER_NOT_FOUND,
// 						statusCode: 502,
// 					})
// 				}
// 				const checkPass = await checkPassword(oldPassword, user!.password)
// 				if (!checkPass) {
// 					return errorHandler({
// 						res,
// 						err: Messages.INVALID_PASSWORD,
// 						statusCode: 502,
// 					})
// 				}
// 				const passwordData = await checkPassword(newPassword, user!.password)
// 				if (passwordData) {
// 					return errorHandler({
// 						res,
// 						err: Messages.RESET_SAME_PASSWORD,
// 						statusCode: 502,
// 					})
// 				}
// 				const encryptedPassword = await hash(newPassword, 10)
// 				const userData = await createPasswordService(
// 					encryptedPassword,
// 					user!.email,
// 					new Date(req.user.iat * 1000)
// 				)
// 				if (userData === null) {
// 					return errorHandler({ res, err: Messages.CHANGE_PASSWORD_FAILED })
// 				} else {
// 					const token = req.headers.authorization?.split(' ')[1]
// 					const data: any = jwt.decode(token!)
// 					if (data?.deviceId) {
// 						const deviceId = data?.deviceId
// 						await removeDevicesExceptOne(req.user.id, deviceId)
// 					}

// 					return responseHandler({ res, msg: Messages.CHANGE_PASSWORD_SUCCESS })
// 				}
// 			}
// 			default: {
// 				return errorHandler({
// 					res,
// 					statusCode: 406,
// 					err: Messages.WRONG_INPUT_PROVIDED,
// 				})
// 			}
// 		}
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

// export const updateUserStatus = async (req: Request, res: Response) => {
// 	Logger.info('Inside update user status controller')
// 	try {
// 		const { userId } = req.params
// 		const {
// 			isPurchaser,
// 			isBlocked,
// 		}: {
// 			isPurchaser: boolean
// 			isBlocked: boolean
// 		} = req.body

// 		const user = await getUserService({ id: userId })
// 		if (user === null) {
// 			return errorHandler({
// 				res,
// 				err: Messages.USER_NOT_FOUND,
// 				statusCode: 502,
// 			})
// 		}
// 		const validator = await updateUserValidation({
// 			isPurchaser,
// 			isBlocked,
// 		})
// 		if (validator.error) {
// 			return errorHandler({ res, err: validator.message })
// 		}

// 		const result = await updateUserService({ isPurchaser, isBlocked }, userId)

// 		if (result === null)
// 			return errorHandler({ res, statusCode: 500, err: Messages.USER_UPDATE_FAILED })

// 		return responseHandler({ res, msg: Messages.USER_STATUS_UPDATE_SUCCESS })
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

// export const createBankAccount = async (req: Request, res: Response) => {
// 	Logger.info('Inside Create Bank Account controller')
// 	try {
// 		let {
// 			account_number,
// 			routing_number,
// 			IBAN,
// 			account_id,
// 			status,
// 			description,
// 			trackingRef,
// 			fingerprint,
// 			billing_name,
// 			billing_city,
// 			billing_country,
// 			billing_line1,
// 			billing_line2,
// 			billing_district,
// 			billing_postalCode,
// 			bank_name,
// 			bank_city,
// 			bank_country,
// 			bank_line1,
// 			bank_line2,
// 			bank_district,
// 			type_of_account,
// 		} = req.body
// 		const userId = req.user.id
// 		const payload: BankDetailsInterfacte = {
// 			id: uuid(),
// 			account_number,
// 			routing_number,
// 			IBAN,
// 			account_id,
// 			status,
// 			description,
// 			tracking_ref: trackingRef,
// 			fingerprint,
// 			billing_name,
// 			billing_city,
// 			billing_country,
// 			billing_line1,
// 			billing_line2,
// 			billing_district,
// 			billing_postalCode,
// 			bank_name,
// 			bank_city,
// 			bank_country,
// 			bank_line1,
// 			bank_line2,
// 			bank_district,
// 			userId,
// 			type_of_account,
// 		}
// 		let circleError: boolean = false
// 		let errMessage: string = ''
// 		if (Config.CIRCLE.CIRCLE_TEST_DATA) {
// 			Logger.info('Adding default circle data')
// 			payload.account_number = Config.CIRCLE.ACCOUNT_NUMBER!
// 			payload.routing_number = Config.CIRCLE.ROUTING_NUMBER!
// 			payload.billing_city = Config.CIRCLE.BILLING_CITY!
// 			payload.billing_country = Config.CIRCLE.BILLING_COUNTRY!
// 			payload.billing_district = Config.CIRCLE.BILLING_DISTRICT!
// 			payload.billing_line1 = Config.CIRCLE.BILLING_LINE1!
// 			payload.billing_postalCode = Config.CIRCLE.POSTAL_CODE!
// 			payload.bank_country = Config.CIRCLE.BANK_COUNTRY!
// 			payload.bank_district = Config.CIRCLE.BANK_DISTRICT!
// 		}
// 		const circleResponse = (await axios
// 			.post(`${Config.PAYMENT.CREATE_BANK_ACCOUNT}`, payload, {
// 				headers: {
// 					authorization: req.headers.authorization!,
// 				},
// 			})
// 			.catch((err) => {
// 				Logger.error(err)
// 				circleError = true
// 				errMessage = err.response.data.msg
// 			}))!
// 		if (circleError) {
// 			await axios
// 				.post(
// 					`${Config.NOTIFICATION.SEND}/${req.user.id}`,
// 					{
// 						title: 'Bank A/C',
// 						body: `Attention! Your ${payload.bank_name} A/C linking with EnverX is failed. Please try again.`,
// 						topic: `user-${req.user.id}`,
// 					},
// 					{
// 						headers: {
// 							authorization: req.headers.authorization!,
// 						},
// 					}
// 				)
// 				.catch((err) => {
// 					Logger.error(err)
// 				})
// 			return errorHandler({
// 				res,
// 				statusCode: 500,
// 				err: errMessage,
// 			})
// 		}
// 		payload.account_id = circleResponse.data.data.data.id
// 		payload.status = circleResponse.data.data.data.status
// 		payload.tracking_ref = circleResponse.data.data.data.trackingRef
// 		payload.fingerprint = circleResponse.data.data.data.fingerprint
// 		payload.description = circleResponse.data.data.data.description
// 		const bankData = await createBankAccountService(payload)
// 		if (bankData === null) {
// 			await axios
// 				.post(
// 					`${Config.NOTIFICATION.SEND}/${req.user.id}`,
// 					{
// 						title: 'Bank A/C',
// 						body: `Attention! Your ${payload.bank_name} A/C linking with EnverX is failed. Please try again.`,
// 						topic: `user-${req.user.id}`,
// 					},
// 					{
// 						headers: {
// 							authorization: req.headers.authorization!,
// 						},
// 					}
// 				)
// 				.catch((err) => {
// 					Logger.error(err)
// 				})
// 			return errorHandler({
// 				res,
// 				statusCode: 500,
// 				err: Messages.BANK_ACCOUNT_CREATED_FAILED,
// 			})
// 		}

// 		await axios
// 			.post(
// 				`${Config.NOTIFICATION.SEND}/${req.user.id}`,
// 				{
// 					title: 'Bank A/C',
// 					body: `${payload.bank_name} a/c is linked to EnverX successfully`,
// 					topic: `user-${req.user.id}`,
// 				},
// 				{
// 					headers: {
// 						authorization: req.headers.authorization!,
// 					},
// 				}
// 			)
// 			.catch((err) => {
// 				Logger.error(err)
// 			})
// 		return responseHandler({
// 			res,
// 			status: 201,
// 			msg: Messages.BANK_ACCOUNT_CREATED_SUCCESS,
// 			data: bankData,
// 		})
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

// export const updatePriceLastUpdated = async (req: Request, res: Response) => {
// 	Logger.info('Inside Price Last Updated controller')
// 	try {
// 		const validator = await priceLastUpdatedValidation(req.body)
// 		if (validator.error) {
// 			return errorHandler({ res, err: validator.message })
// 		}

// 		const data = await updateEchoUserService(req.body, { id: req.user.id })
// 		if (data === 0)
// 			return errorHandler({
// 				res,
// 				statusCode: 402,
// 			})

// 		return responseHandler({ res, msg: Messages.UPDATE_ECHO_USER_SUCCESS })
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, data: { error } })
// 	}
// }

// export const createNewUser = async (req: Request, res: Response) => {
// 	Logger.info('Inside create New User controller')
// 	try {
// 		const payload: UserInterface = req.body
// 		const { email, password, userType } = req.body
// 		const validator = await createNewUserValidator({ email, password, userType })
// 		if (validator.error) {
// 			return errorHandler({ res, statusCode: 400, err: validator.message })
// 		}

// 		const checkEmail = await getUserService({
// 			email: payload.email,
// 		})
// 		if (checkEmail) return errorHandler({ res, statusCode: 409, err: Messages.EMAIL_EXIST })

// 		payload.password! = await hash(payload.password!, 10)
// 		payload.id = uuid()
// 		payload.entityType = 'COMPANY'

// 		const user = await createNewUserService(payload)

// 		const result = await getSumSubAccessTokenService(user.id)
// 		if (!result) {
// 			return errorHandler({
// 				res,
// 				err: Messages.SOMETHING_WENT_WRONG,
// 				statusCode: 500,
// 			})
// 		}
// 		const emailPayload = {
// 			data: `${Config.FE_KYB_URL}/${result.token}`,
// 			email: user.email,
// 		}
// 		const emailSent = await sendEmail(emailPayload, 'sendKYBLink')

// 		if (emailSent?.error) {
// 			return errorHandler({
// 				res,
// 				statusCode: 400,
// 				err: Messages.KYB_LINK_SENT_EMAIL_FAILED,
// 				data: emailSent?.error,
// 			})
// 		}

// 		return responseHandler({
// 			res,
// 			status: 201,
// 			msg: Messages.REGISTRATION_SUCCESS_KYB_LINK_SENT,
// 			data: { email },
// 		})
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 500, err: Messages.INTERNAL_SERVER_ERROR })
// 	}
// }

// export const sendBulkEmails = async (req: Request, res: Response) => {
// 	Logger.info('Inside send BulkEmails controller')
// 	try {
// 		const { emails, templateId, data } = req.body

// 		if (!emails || !templateId || !data)
// 			return errorHandler({
// 				res,
// 				statusCode: 400,
// 				err: 'Please send Emails Array, templateId and data in payload',
// 			})

// 		const emailSent = await sendMultipleEmails(emails, templateId, data)

// 		if (emailSent?.error)
// 			return errorHandler({
// 				res,
// 				statusCode: 400,
// 				err: 'Error Sending Emails',
// 				data: emailSent?.error,
// 			})

// 		return responseHandler({ res, status: 200, msg: 'Mails sent successfully' })
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 500, data: { error } })
// 	}
// }
