import { v4 as uuid } from 'uuid'
import {
	KarykarmInterface,
	SamparkVrundInterface,
	UserInterface,
	satsangProfileInterface,
} from '@interfaces/user'
import { Request, Response } from 'express'
// import jwt from 'jsonwebtoken'
import { Logger } from '@config/logger'
import { loginValidation, registerRequest, satsangProfileRequest } from '@user/validator'
import { errorHandler, responseHandler } from '@helpers/responseHandlers'
import { hash } from 'bcrypt'
import {
	createKarykarm,
	createSamparkVrund,
	createSatsangProfile,
	createUser,
	followUpInitiate,
	getAllKarykarm,
	getAllSamparkKarykar,
	getAllSamparkVrund,
	getAllUser,
	getAttendanceList,
	getFollowUpData,
	getFollowUpList,
	getProfileData,
	getUserService,
	updateFollowUp,
	updateKarykarm,
	updateSatsangProfile,
	updateUser,
	uploadImage,
	verifyPassword,
} from '@user/service'
import Messages from '@helpers/messages'
import { generateToken } from '@helpers/jwt'
import { JWTPayload } from '@interfaces/jwtPayload'

export const createUserApi = async (req: Request, res: Response) => {
	try {
		const {
			// username,
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
			app,
			appId,
			samparkVrund,
		}: {
			// username: string
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
			app: boolean
			appId: string
			samparkVrund: string
		} = req.body

		const userObject: UserInterface = {
			id,
			// username: username
			// 	? username
			// 	: `${firstname.toLowerCase()}${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`,
			firstname,
			middlename,
			lastname,
			mobileNumber,
			mobileUser,
			houseNumber,
			socName,
			nearBy,
			area,
			app,
			appId,
			married,
			education,
			mandal,
			email: email ? email : `${firstname}@gmail.com`,
			seva,
			sevaIntrest,
			password,
			userType: userType === 'karykar' ? 'karykar' : 'yuvak',
			profilePic,
			DOB,
			addressLine1,
			gender,
			samparkVrund,
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
			userObject.id = id
				? id
				: `${firstname.toLowerCase()}${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`
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

export const uploadImageApi = async (req: Request, res: Response) => {
	try {
		const {
			profilePic,
			keyname,
		}: {
			profilePic: any
			keyname: any
		} = req.body

		const fileObject: any = {
			profilePic,
			keyname,
		}

		const location = await uploadImage(fileObject)
		if (location === false) {
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
			data: { location },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const createSatsangProfileApi = async (req: Request, res: Response) => {
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
	try {
		const {
			karykar1profileId,
			karykar2profileId,
			socs,
			vrundName,
		}: {
			karykar1profileId: string
			karykar2profileId: string
			socs: string[]
			vrundName: string
		} = req.body

		const samparkVrundObject: SamparkVrundInterface = {
			karykar1profileId,
			karykar2profileId,
			socs,
			vrundName,
		}

		const karykar1 = await getProfileData({ id: karykar1profileId, userType: 'karykar' })
		const karykar2 = await getProfileData({ id: karykar2profileId, userType: 'karykar' })
		if (karykar1 === null || karykar2 === null) {
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
		// Karykar 1
		await updateUser({
			...karykar1?.dataValues,
			samparkVrund: samparkVrund?.dataValues?.vrundName,
		})
		// Karykar 2
		await updateUser({
			...karykar2?.dataValues,
			samparkVrund: samparkVrund?.dataValues?.vrundName,
		})
		return responseHandler({
			res,
			status: 200,
			msg: Messages.SAMPARK_VRUND_SUCCESS,
			data: { samparkVrund },
		})
		// }
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const assignSamparkKarykarApi = async (req: Request, res: Response) => {
	try {
		const {
			firstname,
			lastname,
			mobileNumber,
			mobileUser,
			email,
			socName,
			userType,
			id,
			samparkVrund,
		}: {
			firstname: string
			lastname: string
			mobileNumber: number
			mobileUser: string
			email: string
			socName: string
			userType: string
			id: string
			samparkVrund: string
		} = req.body

		const userObject: UserInterface = {
			id: id ? id : uuid(),
			firstname,
			lastname,
			mobileNumber,
			mobileUser,
			email,
			socName,
			userType: userType === 'karykar' ? 'karykar' : 'yuvak',
			gender: 'male',
			samparkVrund,
		}

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
		}
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const createKarykarmApi = async (req: Request, res: Response) => {
	try {
		const {
			id,
			karykarmName,
			karykarmTime,
			followUpStart,
			// followUpEnd,
			attendanceStart,
		}: // attendanceEnd,
		{
			id: string
			karykarmName: string
			karykarmTime: Date
			followUpStart: string
			// followUpEnd: boolean
			attendanceStart: string
			// attendanceEnd: boolean
		} = req.body

		const karykarmObject: KarykarmInterface = {
			id: id ? id : uuid(),
			karykarmName,
			karykarmTime,
			followUpStart,
			// followUpEnd,
			attendanceStart,
			// attendanceEnd,
		}

		if (id) {
			const karykarm = await updateKarykarm(karykarmObject)
			if (karykarm === false) {
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
				data: { karykarm },
			})
		} else {
			const karykarm = await createKarykarm(karykarmObject)
			if (karykarm === false) {
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
				data: { karykarm },
			})
		}
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const followUpInitiateApi = async (req: Request, res: Response) => {
	try {
		const {
			id,
			karykarmTime,
			status,
		}: {
			id: string
			karykarmTime: Date
			status: string
		} = req.body

		const karykarmObject: any = {
			id,
			karykarmTime,
			status,
		}

		const karykarm = await followUpInitiate(karykarmObject)
		if (karykarm === false) {
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
			data: { karykarm },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}
export const loginApi = async (req: Request, res: Response) => {
	try {
		const data: { id: string; password: string } = req.body

		const { error, message } = await loginValidation(data)
		if (error) {
			return errorHandler({ res, statusCode: 501, err: message })
		}

		const user = await getUserService({ id: data.id })
		if (user === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}
		const correctUser = await verifyPassword(data.password, user.password || '')

		if (!correctUser)
			return errorHandler({
				res,
				err: Messages.INCORRECT_PASSWORD,
				statusCode: 502,
			})
		const response: JWTPayload = {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			userType: user.userType,
		}
		const token = await generateToken(response)
		return responseHandler({
			res,
			status: 200,
			msg: Messages.LOGIN_SUCCESS,
			data: { ...user, token },
		})
		// const resData: any = {
		// 	mobileNumber: user.mobileNumber,
		// 	countryCode: user.countryCode,
		// 	email: user.email,
		// 	loginAttempt: user.loginAttempt,
		// 	loginBlockedTime: user.loginBlockedTime,
		// 	otplimit: user.otpLimit,
		// 	otpBlockTime: user.otpBlockTime,
		// 	isOTPBlocked: user.isOTPBlocked,
		// 	isLoginBlocked: user.isLoginBlocked,
		// }
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

// export const verifyLogin = async (req: Request, res: Response) => {
// 	try {
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

export const getAllSamparkKarykarAPI = async (req: Request, res: Response) => {
	try {
		const karykarList = await getAllSamparkKarykar({})
		if (karykarList === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}
		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: karykarList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAllUserAPI = async (req: Request, res: Response) => {
	try {
		const {
			userType = 'yuvak',
			samparkVrund = 'A',
			active = true,
			offset = 0,
			limit = 10,
			searchTxt = '',
			orderBy = 'firstname',
			orderType = 'DESC',
		} = req.query

		const strOffset = offset ? offset.toString() : '0'
		const strLimit = limit ? limit.toString() : '10'
		const search = searchTxt ? searchTxt.toString() : ''
		const strorderBy = orderBy ? orderBy.toString() : 'orderBy'
		const strorderType = orderType ? orderType.toString() : 'DESC'

		const userList = await getAllUser(
			parseInt(strOffset!),
			parseInt(strLimit!),
			search,
			strorderBy,
			strorderType,
			userType,
			samparkVrund,
			active
		)
		if (userList === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}
		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: userList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAllKarykarmAPI = async (req: Request, res: Response) => {
	try {
		// const { userType = 'yuvak', samparkVrund = 'A', active = true } = req.query
		const karykarmList = await getAllKarykarm()
		if (karykarmList === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}
		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: karykarmList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getFollowUpListApi = async (req: Request, res: Response) => {
	try {
		const {
			samparkVrund = 'A',
			offset = 0,
			limit = 10,
			searchTxt = '',
			orderBy = 'firstname',
			orderType = 'DESC',
		} = req.query

		const strOffset = offset ? offset.toString() : '0'
		const strLimit = limit ? limit.toString() : '10'
		const search = searchTxt ? searchTxt.toString() : ''
		const strorderBy = orderBy ? orderBy.toString() : 'createdAt'
		const strorderType = orderType ? orderType.toString() : 'DESC'

		const followUpList = await getFollowUpList(
			samparkVrund,
			parseInt(strOffset!),
			parseInt(strLimit!),
			search,
			strorderBy,
			strorderType
		)
		if (followUpList === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: followUpList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAttendanceListApi = async (req: Request, res: Response) => {
	try {
		if (!req?.user?.id)
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 501,
			})
		const attendanceList = await getAttendanceList(req?.user?.id)
		if (attendanceList === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: attendanceList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getFollowUpDataApi = async (req: Request, res: Response) => {
	try {
		const { id = '' } = req.query

		const followUpList = await getFollowUpData({ id })
		if (followUpList === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: followUpList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getProfileDataApi = async (req: Request, res: Response) => {
	try {
		const { id = '' } = req.query

		const profileData = await getProfileData({ id })
		if (profileData === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: profileData })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const updateFollowUpApi = async (req: Request, res: Response) => {
	try {
		const data: { id: string; followUp: boolean; coming: boolean; how: string; remark: string } =
			req.body

		const followUpList = await updateFollowUp(data)
		if (followUpList === null) {
			return errorHandler({
				res,
				err: Messages.USER_NOT_FOUND,
				statusCode: 502,
			})
		}

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}
