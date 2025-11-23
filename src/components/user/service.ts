import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { Logger } from '@config/logger'
import {
	KarykarmInterface,
	SamparkVrundInterface,
	UserInterface,
	satsangProfileInterface,
} from '@interfaces/user'
import User from '@user/user.model'
import SatsangProfile from '@user/SatsangProfile.model'
import SamparkVrund from '@user/SamparkVrund.model'
import { col, fn, literal, Op, Sequelize, where } from 'sequelize'
import Karykarm from './karykarm.model'
import FollowUp from './followUp.model'
import uploadImageToS3 from '@helpers/uploadFile'
import Seva from './Seva.model'
import SevaAllocated from './SevaAllocated.model'
import moment from 'moment'
import SocTable from './soc.model'

export const createUser = async (payload: UserInterface) => {
	try {
		const isExist = await User.findOne({ where: { mobileNumber: payload.mobileNumber } })
		if (isExist) return false
		const user = await User.create(payload)
		if (user) return 'User Created Successfully'
		return 'Something went wrong'
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const uploadImage = async (payload: any) => {
	try {
		const location = await uploadImageToS3(payload.profilePic, payload.keyname)
		return location
	} catch (error) {
		return false
		Logger.error(error)
	}
}

export const updateUser = async (payload: UserInterface) => {
	try {
		// Check if user exists
		const user = await User.findOne({
			where: { id: payload.id },
			attributes: { exclude: ['password'] },
		})

		if (!user) return false

		// Update user
		await user.update(payload)

		return user
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const assignSamparkKarykar = async (payload: UserInterface) => {
	try {
		const isExist = await User.findOne({ where: { mobileNumber: payload.id } })
		if (!isExist) return false
		try {
			const user = await User.findOne({
				where: {
					mobileNumber: payload.id,
					[Op.not]: {
						userType: 'superadmin',
					},
				},
				attributes: { exclude: ['password'] },
			})
				.then((result) => {
					result!.update(
						{
							samparkVrund: payload.samparkVrund,
							active: payload?.active || false,
							deleteReason: payload.deleteReason || '',
							firstname: payload.firstname || '',
							middlename: payload.middlename || '',
							lastname: payload.lastname || '',
							houseNumber: payload.houseNumber || '',
							socName: payload.socName || '',
							nearBy: payload.nearBy || '',
							area: payload.area || '',
						},
						{
							where: {
								mobileNumber: payload.id,
							},
						}
					)
				})
				.catch((error) => {
					Logger.error(error)
					return null
				})
			return user
		} catch (error) {
			Logger.error(error)
		}
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const deleteUser = async (payload: UserInterface) => {
	try {
		const isExist = await User.findOne({ where: { id: payload.id } })
		if (!isExist) return false
		try {
			const user = await User.findOne({
				where: {
					id: payload.id,
					[Op.not]: {
						userType: 'superadmin',
					},
				},
				attributes: { exclude: ['password'] },
			})
				.then((result) => {
					result!.update(
						{
							active: payload?.active || false,
							deleteReason: payload.deleteReason,
						},
						{
							where: {
								id: payload.id,
							},
						}
					)
				})
				.catch((error) => {
					Logger.error(error)
					return null
				})
			return user
		} catch (error) {
			Logger.error(error)
		}
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const createSatsangProfile = async (payload: satsangProfileInterface) => {
	try {
		const isExist = await SatsangProfile.findOne({ where: { userId: payload.userId } })
		if (isExist) return false
		const satsangProfile = await SatsangProfile.create(payload)
		return satsangProfile
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const updateSatsangProfile = async (payload: satsangProfileInterface) => {
	try {
		const satsangProfile = await SatsangProfile.findOne({
			where: {
				userId: payload.userId,
			},
		})
			.then((result) => {
				result!.update(
					{
						...payload,
					},
					{
						where: {
							userId: payload.userId,
						},
					}
				)
			})
			.catch((error) => {
				Logger.error(error)
				return null
			})
		return satsangProfile
	} catch (error) {
		Logger.error(error)
	}
}

export const createSamparkVrund = async (payload: SamparkVrundInterface) => {
	try {
		const isExist = await SamparkVrund.findOne({
			where: {
				mandal: payload.mandal,
				[Op.or]: [
					{ karykar1profileId: payload.karykar1profileId },
					payload.karykar2profileId && { karykar2profileId: payload.karykar2profileId },
					payload.karykar2profileId && { karykar1profileId: payload.karykar2profileId },
					{ karykar2profileId: payload.karykar1profileId },
				],
			},
		})

		if (isExist) return false

		return await SamparkVrund.create(payload)
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const updateSamparkVrund = async (payload: any, mandal: string) => {
	try {
		const result = await SamparkVrund.findOne({
			where: { id: payload.id, mandal },
		})

		if (!result) return null

		await result.update({ ...payload })

		// const userList = await User.findAll({
		// 	where: {
		// 		active: true,
		// 		samparkVrund: oldVrundName,
		// 		mandal,
		// 		[Op.not]: { userType: 'superadmin' },
		// 	},
		// })

		// for (const item of userList) {
		// 	await item.update({ samparkVrund: payload.vrundName })
		// }

		return result
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const getSamparkVrund = async (id: string | any, mandal: string | any) => {
	try {
		const vrund = await SamparkVrund.findOne({
			where: { id, mandal },
			include: [
				{
					model: SocTable,
					attributes: ['id'],
					as: 'societies', // must match @HasMany(() => SocTable)
				},
			],
		})
		if (!vrund) return false
		return vrund
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const deleteSamparkVrund = async (id: string, samparkVrund: string, mandal: string) => {
	try {
		const isExist = await SamparkVrund.findOne({ where: { karykar1profileId: id, mandal } })
		if (!isExist) return false
		await SamparkVrund.destroy({ where: { karykar1profileId: id, mandal } })
		const userList = await User.findAll({
			where: {
				active: true,
				samparkVrund,
				mandal,
				[Op.not]: {
					userType: 'superadmin',
				},
			},
		})
		try {
			await Promise.all(
				userList?.map(async (item) => {
					const user = await User.findOne({
						where: {
							id: item?.dataValues?.id,
							active: true,
						},
					})
						.then((result) => {
							result!.update(
								{
									samparkVrund: '',
								},
								{
									where: {
										id: item?.dataValues?.id,
									},
								}
							)
						})
						.catch((error) => {
							Logger.error(error)
							return null
						})
					return user
				})
			)
		} catch (error) {
			Logger.error(error)
		}
		// await Karykarm.destroy({ where: { id } })
		return true
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const getUserService = async (filter: Partial<UserInterface>) => {
	try {
		const user = await User.findOne({
			where: filter,
			raw: true,
		})
		if (!user) {
			return null
		}
		return user
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllSamparkVrund = async (mandal: string | any) => {
	try {
		// 1️⃣ Get all SamparkVrund with related societies and karykars
		const samparkVrundList = await SamparkVrund.findAll({
			include: [
				{ model: User, as: 'karykar1profile', required: false },
				{ model: User, as: 'karykar2profile', required: false },
				{
					model: SocTable,
					as: 'societies',
					required: false,
				},
			],
			where: { mandal },
			order: [['vrundName', 'ASC']],
		})

		if (!samparkVrundList) return null

		const samparkVrundJSON = samparkVrundList.map((v) => v.toJSON())

		// 2️⃣ Collect all society IDs for counting users and fetching user list
		const allSocietyIds = samparkVrundJSON.flatMap((v) => (v.societies || []).map((s) => s.id))

		// 3️⃣ Get user counts per society in ONE query
		const userCounts = await User.findAll({
			where: {
				socId: { [Op.in]: allSocietyIds },
				userType: 'yuvak',
				active: true,
			},
			attributes: ['socId', [fn('COUNT', col('id')), 'userCount']],
			group: ['socId'],
			raw: true,
		})

		const countsMap = Object.fromEntries(
			userCounts.map((uc: any) => [uc.socId, Number(uc.userCount)])
		)

		// 4️⃣ Get all users belonging to these societies in ONE query
		const userList = await User.findAll({
			where: {
				socId: { [Op.in]: allSocietyIds },
				userType: 'yuvak',
				active: true,
			},
			raw: true,
		})

		// 5️⃣ Attach counts and user list
		const result = samparkVrundJSON.map((vrund) => {
			const societiesWithCount = (vrund.societies || []).map((soc) => ({
				...soc,
				userCount: countsMap[soc.id] || 0,
			}))

			// Users belonging to any society of this vrund
			const users = userList.filter((u) => societiesWithCount.some((s) => s.id === u.socId))

			return {
				...vrund,
				societies: societiesWithCount,
				userList: users,
			}
		})

		return result
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllSamparkKarykar = async (mandal: string | any) => {
	try {
		const karykarList = await User.findAndCountAll({
			where: {
				[Op.or]: [{ userType: 'admin' }, { userType: 'karykar' }],
				...(mandal && { mandal }),
			},
			attributes: { exclude: ['password'] },
		})
		if (!karykarList) {
			return null
		}
		return karykarList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getUpcomingBirthdayList = async (mandal: string | any) => {
	try {
		const yuvakList = await User.findAll({
			where: {
				active: true,
				...(mandal && { mandal }),
			},
			attributes: ['id', 'firstname', 'lastname', 'mobileNumber', 'profilePic', 'DOB', 'active'],
			order: [['DOB', 'ASC']],
		})
		if (!yuvakList) {
			return null
		}

		const today = moment().startOf('day')
		const nextWeek = moment().add(14, 'days').endOf('day')
		return yuvakList?.filter((user) => {
			if (user?.dataValues?.DOB) {
				const dob = moment(user?.dataValues?.DOB).year(moment().year())
				return dob >= today && dob <= nextWeek
			} else {
				return false
			}
		})
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllUser = async (
	offset: number,
	limit: number,
	searchTxt: string,
	orderBy: string,
	orderType: string,
	userType: string | any,
	samparkVrund: string | any,
	active: boolean | any,
	mandal: string | any
) => {
	try {
		// Base user filters
		const userWhere: any = {}
		if (active !== undefined) userWhere.active = active
		if (userType) userWhere.userType = userType
		if (mandal) userWhere.mandal = mandal

		const isMobileSearch = /^\d+$/.test(searchTxt)

		// Search text filter
		if (searchTxt) {
			if (isMobileSearch) {
				delete userWhere.active
			}
			userWhere[Op.or] = [
				{ firstname: { [Op.iLike]: `%${searchTxt}%` } },
				{ lastname: { [Op.iLike]: `%${searchTxt}%` } },
				{ email: { [Op.iLike]: `%${searchTxt}%` } },
				Sequelize.where(Sequelize.cast(Sequelize.col('mobileNumber'), 'TEXT'), {
					[Op.iLike]: `%${searchTxt}%`,
				}),
			]
		}

		// SamparkVrund filter
		const samparkVrundWhere =
			samparkVrund && samparkVrund !== 'NA' && samparkVrund !== ''
				? { vrundName: samparkVrund }
				: undefined

		// Query
		const userList = await User.findAndCountAll({
			offset,
			...(limit !== 30 && { limit }),
			where: userWhere,
			attributes: { exclude: ['password'] },
			order: [[orderBy, orderType]],
			include: [
				{
					model: SocTable,
					required: !!samparkVrundWhere, // INNER JOIN if filter exists
					include: [
						{
							model: SamparkVrund,
							required: !!samparkVrundWhere, // INNER JOIN if filter exists
							attributes: ['id', 'vrundName'],
							where: samparkVrundWhere,
						},
					],
				},
			],
		})

		return userList
	} catch (err) {
		console.error(err)
		return null
	}
}

export const getAttendanceReport = async (
	offset: number,
	limit: number,
	searchTxt: string,
	orderBy: string,
	orderType: string,
	userType: string | any,
	samparkVrund: string | any,
	active: boolean | any
) => {
	try {
		// let options: any = {
		// 	offset,
		// 	...(limit !== 30 && { limit }),
		// 	where: {
		// 		...(userType && { userType }),
		// 		...(samparkVrund && { samparkVrund: samparkVrund === 'NA' ? '' : samparkVrund }),
		// 		active,
		// 	},
		// 	attributes: { exclude: ['password'] },
		// 	order: [[orderBy, orderType]],
		// }
		// if (searchTxt !== '') {
		// 	options.where = {
		// 		...(userType && { userType }),
		// 		...(samparkVrund && { samparkVrund: samparkVrund === 'NA' ? '' : samparkVrund }),
		// 		active,
		// 		[Op.or]: {
		// 			firstname: {
		// 				[Op.iLike]: `%${searchTxt}%`,
		// 			},
		// 			lastname: {
		// 				[Op.iLike]: `%${searchTxt}%`,
		// 			},
		// 			email: {
		// 				[Op.iLike]: `%${searchTxt}%`,
		// 			},
		// 		},
		// 	}
		// }

		const userList = await FollowUp.findAndCountAll({
			// ...options,
			include: [
				{
					model: User,
					as: 'userData',
					foreignKey: 'userId',
					attributes: [
						'id',
						'middlename',
						'deleteReason',
						'active',
						'userType',
						'samparkVrund',
						'mobileNumber',
						'email',
						'firstname',
						'lastname',
						'appId',
					],
				},
				{
					model: Karykarm,
					as: 'karykarmData',
					foreignKey: 'karykarmId',
					attributes: ['id', 'karykarmId', 'karykarmName'],
				},
			],
			attributes: { exclude: ['createdAt', 'updatedAt', 'how', 'appattendance'] },
		})
		if (!userList) {
			return null
		}
		return userList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllKarykarm = async (mandal: string | any) =>
	// userType: string | any,
	// samparkVrund: string | any,
	// active: boolean | any
	{
		try {
			const karykarmList = await Karykarm.findAndCountAll({
				order: [['createdAt', 'DESC']],
				where: {
					...(mandal && { mandal }),
					// 	...(userType && { userType }),
					// 	...(samparkVrund && { samparkVrund }),
					// 	active,
				},
			})
			if (!karykarmList) {
				return null
			}
			return karykarmList
		} catch (err) {
			Logger.error(err)
			return null
		}
	}

export const genrateKarykarmReport = async (
	appId: string | any,
	offset: number | any,
	limit: number | any,
	orderBy: string | any,
	orderType: string | any,
	karykarmId: string | any
) => {
	try {
		let options: any = {
			offset,
			where: {
				karykarmId,
			},
			order: [[orderBy, orderType]],
			include: [
				{
					model: User,
					as: 'userData',
					foreignKey: 'userId',
					attributes: [
						'mobileNumber',
						'email',
						'firstname',
						'lastname',
						'profilePic',
						'appId',
						'socId',
					],
					include: [
						{
							model: SocTable,
							attributes: ['id', 'socName', 'samparkVrundId'],
							required: false,
							as: 'society',
							include: [
								{
									model: SamparkVrund,
									attributes: ['id', 'vrundName', 'karykar1profileId', 'karykar2profileId'],
									required: false,
									as: 'samparkVrund',
									include: [
										{
											model: User,
											attributes: ['id', 'firstname', 'lastname'],
											as: 'karykar1profile',
										},
										{
											model: User,
											attributes: ['id', 'firstname', 'lastname'],
											as: 'karykar2profile',
										},
									],
								},
							],
						},
					],
				},
				{
					model: Karykarm,
					as: 'karykarmData',
					foreignKey: 'karykarmId',
					where: {
						...(karykarmId && { id: karykarmId }),
					},
				},
			],
		}
		const followUpList = await FollowUp.findAndCountAll({
			...options,
		})
		if (!followUpList) {
			return null
		}
		return followUpList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const createKarykarm = async (payload: KarykarmInterface) => {
	try {
		const isExist = await Karykarm.findOne({ where: { karykarmTime: payload.karykarmTime } })
		if (isExist) return false
		const karykarm = await Karykarm.create(payload)
		return karykarm
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const deleteKarykarm = async (id: string) => {
	try {
		const isExist = await Karykarm.findOne({ where: { id } })
		if (!isExist) return false
		await FollowUp.destroy({ where: { karykarmId: id } })
		await Karykarm.destroy({ where: { id } })
		return true
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const updateKarykarm = async (payload: KarykarmInterface) => {
	try {
		const isExist = await Karykarm.findOne({ where: { karykarmTime: payload.karykarmTime } })
		if (!isExist) return false
		try {
			const karykarm = await Karykarm.findOne({
				where: {
					karykarmTime: payload.karykarmTime,
				},
			})
				.then((result) => {
					result!.update(
						{
							...payload,
						},
						{
							where: {
								karykarmTime: payload.karykarmTime,
							},
						}
					)
				})
				.catch((error) => {
					Logger.error(error)
					return null
				})
			return karykarm
		} catch (error) {
			Logger.error(error)
		}
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const followUpInitiate = async (payload: any) => {
	try {
		const isExist = await Karykarm.findOne({ where: { id: payload.id } })
		if (!isExist) return false
		try {
			const karykarm = await Karykarm.findOne({
				where: {
					id: payload.id,
					mandal: payload.mandal,
				},
			})
				.then((result) => {
					result!.update(
						{
							followUpStart: payload.status,
						},
						{
							where: {
								id: payload.id,
								mandal: payload.mandal,
							},
						}
					)
				})
				.catch((error) => {
					Logger.error(error)
					return null
				})
			if (payload.status === 'start') {
				const userList = await User.findAll({
					where: {
						active: true,
						mandal: payload.mandal,
						[Op.not]: {
							userType: 'superadmin',
						},
					},
				})
				await Promise.all(
					userList?.map(
						async (item) =>
							await FollowUp.create({
								id: uuid(),
								followUp: false,
								attendance: false,
								appattendance: false,
								userId: item?.dataValues?.id,
								karykarmId: payload.id,
								coming: false,
								samparkVrund: item?.dataValues?.samparkVrund,
								how: '',
								remark: '',
							})
					)
				)
			}
			return karykarm
		} catch (error) {
			Logger.error(error)
		}
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const getFollowUpList = async (
	userType: string | any,
	samparkVrund: string | any,
	followUp: string,
	coming: string,
	attendance: string,
	appattendance: string,
	appId: string,
	offset: number,
	limit: number,
	searchTxt: string,
	orderBy: string,
	orderType: string,
	karykarmId: string,
	followUpStart: string,
	mandal: string | any
) => {
	try {
		let options: any = {
			offset,
			limit,
			where: {
				...(coming && { coming: coming === 'true' }),
				...(attendance && { attendance: attendance === 'true' }),
				...(appattendance && { appattendance: appattendance === 'true' }),
				...(followUp && { followUp: followUp === 'true' }),
			},
			order: [[orderBy, orderType]],
			include: [
				{
					model: User,
					as: 'userData', // Ensure that 'userData' is the alias used for the User relation
					attributes: ['firstname', 'lastname', 'email', 'profilePic', 'mobileNumber'], // Select only the firstname and lastname
					required: true, // Set to false if you want to include FollowUp records even if User isn't found
					where: {
						...(mandal && { mandal }),
						...(userType && { userType }),
						[Op.or]: [
							{ firstname: { [Op.iLike]: `%${searchTxt}%` } },
							{ email: { [Op.iLike]: `%${searchTxt}%` } },
							{ lastname: { [Op.iLike]: `%${searchTxt}%` } },
							Sequelize.where(Sequelize.cast(Sequelize.col('mobileNumber'), 'TEXT'), {
								[Op.iLike]: `%${searchTxt}%`,
							}),
						],
					},
					include: [
						{
							model: SocTable, // Include SamparkVrund for each User
							attributes: ['samparkVrundId'], // Select only the vrundName from SamparkVrund
							required: samparkVrund ? true : false, // Set to false to include FollowUp even if there's no SamparkVrund
							include: [
								{
									model: SamparkVrund,
									attributes: ['vrundName'],
									where: {
										...(samparkVrund && { vrundName: samparkVrund }),
									},
								},
							],
						},
					],
				},
				{
					model: Karykarm,
					as: 'karykarmData', // Alias for the Karykarm relation
					attributes: ['karykarmName'], // Select fields you need from Karykarm
					required: true, // Set to false to include FollowUp records even if Karykarm isn't found
					where: {
						...(followUpStart && { followUpStart }), // Apply filter for followUpStart (>=)
					},
				},
			],
		}
		const followUpList = await FollowUp.findAndCountAll({
			...options,
		})
		if (!followUpList) {
			return null
		}
		return followUpList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAttendanceList = async (userId: string, mandal: string | any) => {
	try {
		const followUpList = await FollowUp.findAndCountAll({
			where: { userId },
			include: [
				{
					model: User,
					as: 'userData',
					foreignKey: 'userId',
					attributes: ['mobileNumber', 'email', 'firstname', 'lastname', 'appId'],
					where: {
						...(mandal && { mandal }),
					},
				},
				{
					model: Karykarm,
					as: 'karykarmData',
					foreignKey: 'karykarmId',
					where: {
						...(mandal && { mandal }),
					},
				},
			],
			order: [['createdAt', 'DESC']],
		})
		if (!followUpList) {
			return null
		}
		return followUpList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllSeva = async (userId: string, sevaId: string) => {
	try {
		const followUpList = await SevaAllocated.findAndCountAll({
			where: { ...(sevaId && { sevaId }), ...(userId && { userId }) },
			include: [
				{
					model: User,
					as: 'userData',
					foreignKey: 'userId',
					attributes: [
						'firstname',
						'middlename',
						'lastname',
						'mobileNumber',
						'active',
						'profilePic',
					],
				},
				{
					model: Seva,
					as: 'sevaData',
					foreignKey: 'sevaId',
					attributes: ['sevaName'],
				},
			],
			order: [['id', 'DESC']],
		})
		if (!followUpList) {
			return null
		}
		return followUpList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getFollowUpData = async (payload: any) => {
	try {
		const followUpList = await FollowUp.findOne({
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			where: { id: payload.id },
			include: [
				{
					model: User,
					as: 'userData',
					attributes: ['firstname', 'lastname'],
					include: [
						{
							model: SocTable,
							as: 'society', // matches @BelongsTo in User
							attributes: ['socName'],
							include: [
								{
									model: SamparkVrund,
									attributes: ['vrundName'],
								},
							],
						},
					],
				},
				{ model: Karykarm, as: 'karykarmData', foreignKey: 'karykarmId' },
			],
		})
		if (!followUpList) {
			return null
		}
		return followUpList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getProfileData = async (payload: any) => {
	try {
		const profileData = await User.findOne({
			where: { id: payload.id },
			// include: [{ model: SatsangProfile, as: 'satsangData', foreignKey: 'userId' }],
			attributes: { exclude: ['password'] },
			include: [
				{
					model: SocTable,
					as: 'society', // matches @BelongsTo in User
					attributes: ['socName'],
					include: [
						{
							model: SamparkVrund,
							attributes: ['vrundName'],
						},
					],
				},
			],
		})
		if (!profileData) {
			return null
		}
		return profileData
	} catch (err) {
		Logger.error(err)
		return null
	}
}
export const satsangData = async (payload: any) => {
	try {
		const profileData = await SatsangProfile.findOne({
			where: { userId: payload.id },
		})
		if (!profileData) {
			return null
		}
		return profileData
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const updateFollowUp = async (payload: any) => {
	try {
		const isExist = await FollowUp.findOne({ where: { id: payload.id } })
		if (!isExist) return false
		try {
			const followUp = await FollowUp.findOne({
				where: {
					id: payload.id,
				},
			})
				.then((result) => {
					result!.update(
						{
							followUp: payload.followUp,
							coming: payload.coming,
							how: payload.how,
							remark: payload.remark,
						},
						{
							where: {
								id: payload.id,
							},
						}
					)
				})
				.catch((error) => {
					Logger.error(error)
					return null
				})
			return followUp
		} catch (error) {
			Logger.error(error)
		}
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const changeAttendance = async (payload: any) => {
	try {
		const followUp = await FollowUp.findOne({
			where: { userId: payload.userId, karykarmId: payload.karykarmId },
		})

		if (!followUp) return false
		await followUp.update({
			attendance: payload.attendance,
			appattendance: payload.appattendance,
		})

		return followUp
	} catch (error: any) {
		Logger.error(`Error updating attendance: ${error?.message}`)
		throw error
	}
}

export const updateBulkAttendance = async (usersList: string[], karykarmId: string) => {
	try {
		if (!usersList || usersList.length === 0)
			return { success: false, missingUsers: [], message: 'No users provided.' }

		const names = usersList.map((user) => {
			const [firstName, lastName] = user.trim().split(' ')
			return { firstName, lastName }
		})

		const users = await User.findAll({
			where: {
				[Op.or]: names.map((n) => ({
					firstname: { [Op.iLike]: n.firstName },
					lastname: { [Op.iLike]: n.lastName },
				})),
			},
			attributes: ['id', 'firstname', 'lastname'],
		})

		if (users.length === 0)
			return { success: false, missingUsers: usersList, message: 'No matching users found.' }

		const userIds = users.map((u) => u?.get('id'))

		const followUps = await FollowUp.findAll({
			where: {
				userId: userIds,
				karykarmId,
			},
			attributes: ['userId'],
		})

		const foundUserNames = followUps.map((f) => {
			const user = users.find((u) => u?.get('id') === f?.get('userId'))
			return `${user?.get('firstname')} ${user?.get('lastname')}`?.toLowerCase()
		})

		const missingUsers = usersList.filter((u) => !foundUserNames.includes(u?.toLowerCase()))

		await FollowUp.update(
			{ attendance: true, appattendance: true },
			{
				where: {
					userId: userIds,
					attendance: false,
					karykarmId,
				},
			}
		)

		return { success: true, missingUsers: missingUsers || [] }
	} catch (error) {
		Logger.error('Error in updateBulkAttendance:', error)
		throw error
	}
}

export const login = async (filter: Partial<UserInterface>) => {
	try {
		const user = await User.findOne({ where: { ...filter, active: true } })
		if (!user) {
			return null
		}
		return user
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const verifyPassword = async (
	enteredPassword: string,
	storedPassword: string
): Promise<boolean> => {
	try {
		return await bcrypt.compare(enteredPassword, storedPassword)
	} catch (err) {
		Logger.error(err)
		return false
	}
}

export const createSoc = async (payload) => {
	try {
		const isExist = await SocTable.findOne({
			where: { socName: payload?.socName, area: payload?.area },
		})
		if (isExist) return false
		const soc = await SocTable.create(payload)
		return soc
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const deleteSoc = async (id: string | any) => {
	try {
		// const userCount = await User.count({ where: { socId: id } })
		// if (userCount > 0) {
		// 	return {
		// 		success: false,
		// 		message: 'Cannot delete society because users are linked to it.',
		// 	}
		// }
		const soc = await SocTable.findOne({ where: { id } })
		if (!soc) return false

		// Set socId = null for all users
		await User.update({ socId: null }, { where: { socId: id } })

		await SocTable.destroy({ where: { id } })

		return { success: true }
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const updateSoc = async (payload) => {
	try {
		const isExist = await SocTable.findOne({ where: { id: payload.id } })
		if (!isExist) return false
		try {
			const soc = await SocTable.findOne({
				where: {
					id: payload.id,
				},
			})
				.then((result) => {
					result!.update(
						{
							...payload,
						},
						{
							where: {
								id: payload.id,
							},
						}
					)
				})
				.catch((error) => {
					Logger.error(error)
					return null
				})
			return soc
		} catch (error) {
			Logger.error(error)
		}
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const getAllSocList = async (id: any) => {
	try {
		const socRows = await SocTable.findAll({
			attributes: [
				'id',
				'socName',
				'area',
				[fn('COUNT', col('users.id')), 'userCount'],
				// total user count across all societies as a window function
				[literal('SUM(COUNT(users.id)) OVER ()'), 'totalUsers'],
				[col('samparkVrund.vrundName'), 'vrundName'],
			],
			include: [
				{
					model: User,
					attributes: [],
					required: false,
					where: {
						active: true,
						mandal: 'utsav',
					},
				},
				{
					model: SamparkVrund,
					as: 'samparkVrund',
					attributes: [],
					required: false,
				},
			],
			...(id && { where: { id } }),
			group: ['SocTable.id', 'samparkVrund.id'],
			order: [['socName', 'ASC']],
			raw: true,
		})

		if (!socRows || socRows.length === 0) {
			return { count: 0, rows: [], totalUsers: 0 }
		}

		// totalUsers will be the same for each row because of the window function
		const totalUsers = Number((socRows[0] as any).totalUsers)

		return {
			count: socRows.length,
			rows: socRows,
			totalUsers,
		}
	} catch (err) {
		Logger.error(err)
		return { count: 0, rows: [], totalUsers: 0 }
	}
}

const normalize = (v) =>
	v
		?.trim()
		?.toLowerCase()
		?.replace(/\s+/g, ' ')
		?.replace(/\b\w/g, (c) => c.toUpperCase())

export const migrateSocieties = async () => {
	// STEP 1: Fetch unique socName + area
	const societies = await User.findAll({
		attributes: ['id', 'houseNumber', 'socName', 'nearBy', 'area', 'socId'],
		raw: true,
	})

	// const socMap = new Map()

	// STEP 2: Create SocTable with normalized text
	for (const soc of societies) {
		try {
			if (!soc?.socName?.trim() || soc?.socId) continue

			// Normalize
			const normalizedSocName = normalize(soc.socName)
			const normalizedArea = normalize(soc.nearBy)

			const isExist = await SocTable.findOne({
				where: {
					[Op.and]: [
						where(fn('LOWER', col('socName')), soc?.socName?.toLowerCase()),
						where(fn('LOWER', col('area')), soc?.nearBy?.toLowerCase()),
					],
				},
			})
			if (isExist) {
				if (!soc?.socId?.trim()) {
					console.log(`Society exists: ${isExist?.dataValues?.id}, ${soc?.id}`)
					await User.update(
						{
							socId: isExist?.dataValues?.id,
							houseNumber: soc.houseNumber?.trim(),
							socName: normalizedSocName?.trim(),
							nearBy: normalizedArea?.trim(),
							area: soc?.area?.trim(),
						}, //
						{ where: { id: soc.id } }
					)
				}
			} else {
				const newId = uuid()
				await SocTable.create({
					id: newId,
					socName: normalizedSocName,
					area: normalizedArea,
				})
				console.log(`Created new society: ${newId}, ${soc?.id}`)
				await User.update(
					{
						socId: newId,
						houseNumber: soc.houseNumber?.trim(),
						socName: normalizedSocName?.trim(),
						nearBy: normalizedArea?.trim(),
						area: soc?.area?.trim(),
					}, //
					{ where: { id: soc.id } }
				)
			}
		} catch (error) {
			Logger.error(`Error processing society for user ID ${soc.id}: ${error}`)
		}

		// socMap.set(`${normalizedSocName}-${normalizedArea}`, newId)
	}

	// STEP 3: Batch update Users
	// const limit = 5000
	// let offset = 0

	// while (true) {
	// 	const users = await User.findAll({ limit, offset })

	// 	if (users.length === 0) break

	// 	const updates: Promise<any>[] = []

	// 	for (const u of users) {
	// 		if (!u.socName || !u.nearBy) continue

	// 		// Normalize same way
	// 		const normalizedSocName = u.socName.charAt(0).toUpperCase() + u.socName.slice(1).toLowerCase()

	// 		const normalizedArea = u.nearBy.charAt(0).toUpperCase() + u.nearBy.slice(1).toLowerCase()

	// 		const key = `${normalizedSocName}-${normalizedArea}`
	// 		const socId = socMap.get(key)

	// 		if (socId) {
	// 			updates.push(
	// 				User.update(
	// 					{
	// 						socId,
	// 						socName: normalizedSocName,
	// 						area: normalizedArea,
	// 					}, //
	// 					{ where: { id: u.id } }
	// 				)
	// 			)
	// 		}
	// 	}

	// 	await Promise.all(updates)
	// 	offset += limit
	// 	console.log(`Updated ${offset} users...`)
	// }

	return { message: 'Society migration completed successfully!' }
}
