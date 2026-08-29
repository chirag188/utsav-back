import { satsangProfileInterface } from '@interfaces/user'
import { Request, Response } from 'express'
import { Logger } from '@config/logger'
import { loginValidation, registerRequest } from '@user/validator'
import { errorHandler, responseHandler } from '@helpers/responseHandlers'
import {
	assignSamparkKarykar,
	changeAttendance,
	upsertKarykarm,
	deleteKarykarm,
	deleteSamparkVrund,
	deleteSoc,
	deleteUser,
	followUpInitiate,
	// generateKarykarmReport,
	getAllKarykarm,
	getAllSamparkKarykar,
	getAllSamparkVrund,
	getAllSeva,
	getAllSocList,
	getAllUser,
	getAttendanceList,
	getAttendanceReport,
	getFollowUpData,
	getFollowUpList,
	getProfileData,
	getSamparkVrund,
	getUpcomingBirthdayList,
	getUserService,
	migrateSocieties,
	satsangData,
	updateBulkAttendance,
	updateFollowUp,
	uploadImage,
	upsertSamparkVrund,
	upsertSatsangProfile,
	upsertUser,
	verifyPassword,
	forgotPassword,
	verifyForgotPasswordOtp,
	updatePassword,
	upsertSoc,
	getKarykarm,
} from '@user/service'
import Messages from '@helpers/messages'
import { generateToken } from '@helpers/jwt'
import { JWTPayload } from '@interfaces/jwtPayload'
import SocTable from './soc.model'
import { Op } from 'sequelize'

const upsertApi = async (
	req: Request,
	res: Response,
	upsertFunction: (data: any) => Promise<any>,
	entityName: string,
	extraLogic?: (data: any, result: any) => Promise<void>
) => {
	try {
		const data = req.body
		const validator =
			entityName === 'User' && !data.id ? await registerRequest(data) : { error: false }
		if (validator.error) return errorHandler({ res, err: (validator as any).message })

		const result = await upsertFunction(data)
		if (!result)
			return errorHandler({
				res,
				statusCode: 409,
				err: data.id ? `${entityName} Not Updated` : `${entityName} Not Created`,
			})
		if (result?.error) {
			return errorHandler({
				res,
				statusCode: 409,
				err: result?.error,
			})
		}

		if (extraLogic) await extraLogic(data, result)

		return responseHandler({
			res,
			status: 200,
			msg: data.id ? `${entityName} Updated Successfully` : `${entityName} Created Successfully`,
			data: { [entityName.toLowerCase()]: result },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

const getListApi = async (
	req: Request,
	res: Response,
	getFunction: (...args: any[]) => Promise<any>,
	entityName: string,
	queryKeys: string[] = []
) => {
	try {
		const args = queryKeys.map((key) => req.query[key] || '')
		const list = await getFunction(...args)
		if (!list)
			return errorHandler({
				res,
				statusCode: 502,
				err: `${entityName} Not Found`,
			})
		return responseHandler({
			res,
			msg: `${entityName} Retrieved Successfully`,
			data: list,
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

const deleteApi = async (
	req: Request,
	res: Response,
	deleteFunction: (id: string) => Promise<any>,
	entityName: string
) => {
	try {
		const id = req.body.id || req.query.id
		if (!id)
			return errorHandler({
				res,
				statusCode: 409,
				err: `${entityName} ID Required`,
			})

		const deleted = await deleteFunction(id)
		if (!deleted)
			return errorHandler({
				res,
				statusCode: 409,
				err: `${entityName} Not Found`,
			})

		return responseHandler({
			res,
			status: 200,
			msg: `${entityName} Deleted Successfully`,
			data: { deleted },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const createUserApi = (req: Request, res: Response) =>
	upsertApi(req, res, upsertUser, 'User', async (data, user) => {
		if (!data.id) {
			const satsangProfileDefaults: satsangProfileInterface = {
				userId: user.dataValues.id,
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
				sspYear: 0,
				niymitVanchan: false,
				niymitVanchanYear: 0,
			}
			await upsertSatsangProfile(satsangProfileDefaults)
		}
	})

export const createKarykarmApi = (req: Request, res: Response) => {
	// if (!req.body.id) {
	// 	req.body.id = req.body.karykarmName
	// }
	upsertApi(req, res, upsertKarykarm, 'Karykarm')
}

export const createSocApi = (req: Request, res: Response) =>
	upsertApi(req, res, upsertSoc, 'Society')

export const createSamparkVrundApi = (req: Request, res: Response) =>
	upsertApi(req, res, upsertSamparkVrund, 'SamparkVrund', async (data, result) => {
		const samparkVrundId = result?.dataValues?.id
		if (!samparkVrundId) return

		const socIds = Array.isArray(data.socs)
			? data.socs
			: typeof data.socs === 'string'
				? [data.socs]
				: []

		// Start transaction for atomic operations
		await (SocTable as any).sequelize.transaction(async (transaction) => {
			// 1️⃣ Clear current associations that are not in the new list
			await SocTable.update(
				{ samparkVrundId: null },
				{
					where: {
						samparkVrundId,
						id: { [Op.notIn]: socIds }, // only clear socs that are not in the new list
					},
					transaction,
				}
			)

			// 2️⃣ Assign the new socIds that are unassigned or empty
			if (socIds.length) {
				await SocTable.update(
					{ samparkVrundId },
					{
						where: {
							id: socIds,
							[Op.or]: [{ samparkVrundId: null }, { samparkVrundId: '' }],
						},
						transaction,
					}
				)
			}
		})
	})

export const updateSatsangProfileApi = (req: Request, res: Response) =>
	upsertApi(req, res, upsertSatsangProfile, 'SatsangProfile')

export const uploadImageApi = async (req: Request, res: Response) => {
	try {
		const { profilePic, keyname } = req.body
		const location = await uploadImage({ profilePic, keyname })

		if (!location) {
			return errorHandler({ res, statusCode: 409, err: Messages.NOT_EMAIL_EXIST })
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

export const getSamparkVrundApi = async (req: Request, res: Response) => {
	try {
		const id = String(req.query.id || '')
		const mandal = String(req.query.mandal || '')

		const samparkVrund = await getSamparkVrund(id, mandal)

		if (!samparkVrund) {
			return errorHandler({ res, statusCode: 409, err: 'Group Not Found' })
		}

		return responseHandler({
			res,
			status: 200,
			msg: 'Group Details',
			data: { samparkVrund },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

// export const updateSamparkVrundApi = async (req: Request, res: Response) => {
// 	try {
// 		const { id, karykar1profileId, karykar2profileId, socs, mandal } = req.body
// 		const socIds = Array.isArray(socs) ? socs : typeof socs === 'string' ? socs.split(',') : []

// 		const samparkVrundObject = {
// 			id,
// 			karykar1profileId,
// 			karykar2profileId: karykar2profileId || null,
// 			mandal,
// 		}

// 		const [karykar1, karykar2] = await Promise.all([
// 			karykar1profileId ? getProfileData({ id: karykar1profileId }) : null,
// 			karykar2profileId ? getProfileData({ id: karykar2profileId }) : null,
// 		])

// 		if ((karykar1profileId && !karykar1) || (karykar2profileId && !karykar2)) {
// 			return errorHandler({ res, statusCode: 400, err: Messages.NOT_EMAIL_EXIST })
// 		}

// 		const updated = await upsertSamparkVrund(samparkVrundObject)
// 		await SocTable.update({ samparkVrundId: null }, { where: { samparkVrundId: id } })
// 		if (socIds.length)
// 			await SocTable.update(
// 				{ samparkVrundId: id },
// 				{
// 					where: {
// 						id: socIds,
// 						[Op.or]: [
// 							{ samparkVrundId: null }, // Not assigned
// 							{ samparkVrundId: '' }, // Empty string (also considered not assigned)
// 						],
// 					},
// 				}
// 			)

// 		return responseHandler({
// 			res,
// 			status: 200,
// 			msg: Messages.SAMPARK_VRUND_SUCCESS,
// 			data: { updated },
// 		})
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

export const assignSamparkKarykarApi = async (req: Request, res: Response) => {
	try {
		const userObject = req.body

		if (!userObject.id) return

		const user = await assignSamparkKarykar(userObject)
		if (!user) {
			return errorHandler({ res, statusCode: 409, err: 'Not able to assign sampark Karykar' })
		}

		return responseHandler({
			res,
			status: 200,
			msg: Messages.YUVAK_UPDATED_SUCCESS,
			data: { user },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const deleteUserApi = async (req: Request, res: Response) => {
	try {
		const { id, active, deleteReason } = req.body
		if (!id) return errorHandler({ res, statusCode: 400, err: 'User ID required' })

		const deleted = await deleteUser({
			id,
			active,
			deleteReason,
		}) // full UserInterface
		if (!deleted) return errorHandler({ res, statusCode: 409, err: 'User not deleted' })

		return responseHandler({
			res,
			status: 200,
			msg: 'User deleted successfully',
			data: { deleted },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const deleteKarykarmApi = (req: Request, res: Response) =>
	deleteApi(req, res, deleteKarykarm, 'Karykarm')

export const deleteSocApi = (req: Request, res: Response) =>
	deleteApi(req, res, deleteSoc, 'Society')

export const deleteSamparkVrundApi = (req: Request, res: Response) => {
	req.body.id = req.body.karykar1profileId
	deleteApi(req, res, (id: string) => deleteSamparkVrund(id, req.body.mandal), 'SamparkVrund')
}

export const followUpInitiateApi = async (req: Request, res: Response) => {
	try {
		const karykarmObject = req.body
		if (!karykarmObject.id) return

		const karykarm = await followUpInitiate(karykarmObject)
		if (!karykarm) {
			return errorHandler({ res, statusCode: 409, err: 'Karykarm Not Found' })
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
		const { id, password } = req.body

		const { error, message } = await loginValidation({ id, password })
		if (error) return errorHandler({ res, statusCode: 501, err: message })

		const user = await getUserService({ id })
		if (!user) return errorHandler({ res, statusCode: 502, err: Messages.USER_NOT_FOUND })

		const isPasswordCorrect = await verifyPassword(password, user.password || '')
		if (!isPasswordCorrect)
			return errorHandler({ res, statusCode: 502, err: Messages.INCORRECT_PASSWORD })

		const payload: JWTPayload = {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			userType: user.userType,
		}

		const token = await generateToken(payload)

		return responseHandler({
			res,
			status: 200,
			msg: Messages.LOGIN_SUCCESS,
			data: { ...user, token },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const forgotPasswordApi = async (req: Request, res: Response) => {
	try {
		const result = await forgotPassword(req.body)
		if (result?.error) {
			return errorHandler({ res, statusCode: 502, err: result.error })
		}

		return responseHandler({
			res,
			status: result?.success ? 200 : 400,
			msg: result?.message || Messages.PASSWORD_RESET_LINK_SENT_EMAIL,
			data: result?.data,
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const verifyForgotPasswordOtpApi = async (req: Request, res: Response) => {
	try {
		const result = await verifyForgotPasswordOtp(req.body)
		if (result?.error) {
			return errorHandler({ res, statusCode: 502, err: result.error })
		}

		return responseHandler({
			res,
			status: 200,
			msg: result?.message || 'OTP verified successfully',
			data: result?.data,
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const updatePasswordApi = async (req: Request, res: Response) => {
	try {
		const result = await updatePassword(req.body)
		if (result?.error) {
			return errorHandler({ res, statusCode: 502, err: result.error })
		}

		return responseHandler({
			res,
			status: 200,
			msg: result?.message || Messages.CHANGE_PASSWORD_SUCCESS,
			data: result?.data,
		})
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
		const mandal = (req.query.mandal as string) || ''
		const samparkVrundList = await getAllSamparkVrund(mandal)

		if (!samparkVrundList) {
			return errorHandler({ res, err: 'Groups Not Found', statusCode: 502 })
		}

		return responseHandler({
			res,
			msg: 'Groups Retrieved Successfully',
			data: samparkVrundList,
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const wakeUpApi = async (req: Request, res: Response) => {
	try {
		return responseHandler({ res, msg: 'Wake up bro you can sleep today' })
	} catch (error) {
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAllSamparkKarykarAPI = async (req: Request, res: Response) => {
	try {
		const mandal = (req.query.mandal as string) || ''
		const karykarList = await getAllSamparkKarykar(mandal)

		if (!karykarList) {
			return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })
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
			offset = '0',
			limit = '10',
			searchTxt = '',
			orderBy = 'firstname',
			orderType = 'DESC',
			userType = 'yuvak',
			samparkVrund = '',
			active = 'true',
			mandal = '',
		} = req.query as Record<string, string>

		const userList = await getAllUser(
			parseInt(offset),
			parseInt(limit),
			searchTxt,
			orderBy,
			orderType,
			userType,
			samparkVrund,
			active === 'true',
			mandal
		)

		if (!userList) {
			return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })
		}

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: userList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAttendanceListApi = async (req: Request, res: Response) => {
	try {
		const { userId = '', mandal = '' } = req.query as Record<string, string>
		const attendanceList = await getAttendanceList(userId, mandal)

		if (!attendanceList)
			return errorHandler({ res, err: 'Attendance List Not Found', statusCode: 502 })

		return responseHandler({ res, msg: 'Attendance list found', data: attendanceList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAttendanceReportAPI = async (req: Request, res: Response) => {
	try {
		const {
			userType = 'yuvak',
			samparkVrund = 'A',
			active = 'true',
			offset = '0',
			limit = '10',
			searchTxt = '',
			orderBy = 'firstname',
			orderType = 'DESC',
			lastMonths = '',
		} = req.query as Record<string, string>

		const userList = await getAttendanceReport(
			parseInt(offset),
			parseInt(limit),
			searchTxt,
			orderBy,
			orderType,
			userType,
			samparkVrund,
			active === 'true',
			lastMonths
		)

		if (!userList) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: userList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAllKarykarmAPI = async (req: Request, res: Response) => {
	try {
		const { mandal = '' } = req.query as Record<string, string>
		const karykarmList = await getAllKarykarm(mandal)

		if (!karykarmList) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: karykarmList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getKarykarmAPI = async (req: Request, res: Response) => {
	try {
		const { id = '' } = req.query as Record<string, string>
		const karykarmList = await getKarykarm(id)

		if (!karykarmList) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: karykarmList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

// export const genrateKarykarmReportAPI = async (req: Request, res: Response) => {
// 	try {
// 		const { karykarmId = '' } = req.query as Record<string, string>

// 		const reportList = await generateKarykarmReport(karykarmId)

// 		if (!reportList) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

// 		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: reportList })
// 	} catch (error) {
// 		Logger.error(error)
// 		return errorHandler({ res, statusCode: 400, data: { error } })
// 	}
// }

export const getFollowUpListApi = async (req: Request, res: Response) => {
	try {
		const {
			userType = '',
			mandal = '',
			samparkVrund = '',
			coming = '',
			attendance = '',
			appattendance = '',
			followUp = '',
			offset = '0',
			limit = '10',
			searchTxt = '',
			orderBy = 'createdAt',
			orderType = 'ASC',
			followUpStart = '',
			karykarmId = '',
			activeGroup,
		} = req.query as Record<string, string>

		const followUpList = await getFollowUpList(
			userType,
			samparkVrund,
			followUp,
			coming,
			attendance,
			appattendance,
			parseInt(offset),
			parseInt(limit),
			searchTxt,
			orderBy,
			orderType,
			followUpStart,
			mandal,
			karykarmId,
			activeGroup !== undefined ? activeGroup === 'true' : undefined
		)

		if (!followUpList)
			return errorHandler({ res, err: 'Follow Up List Not Found', statusCode: 502 })

		return responseHandler({ res, msg: 'Follow Up list found', data: followUpList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getAllSevaAPI = async (req: Request, res: Response) => {
	try {
		const { userId, sevaId } = req.body
		const sevaList = await getAllSeva(userId, sevaId)
		if (!sevaList) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: sevaList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getUpcomingBirthdayListAPI = async (req: Request, res: Response) => {
	try {
		const mandal = (req.query.mandal as string) || ''
		const yuvakList = await getUpcomingBirthdayList(mandal)
		if (!yuvakList) return errorHandler({ res, err: 'There is no user found', statusCode: 502 })

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS, data: yuvakList })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getFollowUpDataApi = async (req: Request, res: Response) => {
	try {
		const id = (req.query.id as string) || ''
		const followUpData = await getFollowUpData({ id })
		if (!followUpData)
			return errorHandler({ res, err: 'User Follow Up Data Not Found', statusCode: 502 })

		return responseHandler({ res, msg: 'Success', data: followUpData })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getProfileDataApi = async (req: Request, res: Response) => {
	try {
		const id = (req.query.id as string) || ''
		const profileData = await getProfileData({ id })
		const satsangUserData = await satsangData({ id })
		if (!profileData) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

		return responseHandler({
			res,
			msg: Messages.GET_USER_SUCCESS,
			data: { ...profileData.dataValues, satsangUserData },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const updateFollowUpApi = async (req: Request, res: Response) => {
	try {
		const data = req.body
		const updated = await updateFollowUp(data)
		if (!updated) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const changeAttendanceApi = async (req: Request, res: Response) => {
	try {
		const data = req.body
		const updated = await changeAttendance(data)
		if (!updated) return errorHandler({ res, err: Messages.USER_NOT_FOUND, statusCode: 502 })

		return responseHandler({ res, msg: Messages.GET_USER_SUCCESS })
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const bulkAttendanceApi = async (req: Request, res: Response) => {
	try {
		const { users, karykarmId } = req.body

		if (!users?.length) {
			return errorHandler({ res, err: 'No users found to update attendance for.', statusCode: 400 })
		}

		const result = await updateBulkAttendance(users, karykarmId)

		if (!result.success) {
			return errorHandler({
				res,
				data: result.missingUsers,
				err: result.message,
				statusCode: 502,
			})
		}

		return responseHandler({
			res,
			data: result.missingUsers,
			msg: 'Users attendance updated successfully.',
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const getCustomSocApi = async (req: Request, res: Response) => {
	try {
		const id = (req.query.id as string) || ''
		const socList = await getAllSocList(id)

		if (!socList) {
			return errorHandler({ res, statusCode: 409, err: 'Society List Not Found' })
		}

		return responseHandler({
			res,
			status: 200,
			msg: 'Society List Found Successfully',
			data: { socList },
		})
	} catch (error) {
		Logger.error(error)
		return errorHandler({ res, statusCode: 400, data: { error } })
	}
}

export const migrateSocApi = async (req: Request, res: Response) => {
	try {
		const result = await migrateSocieties()
		return responseHandler({ res, status: 200, msg: 'Migration Successful', data: result })
	} catch (error: any) {
		Logger.error('Migration Error:', error)
		return errorHandler({ res, statusCode: 500, data: { error: error.message } })
	}
}
