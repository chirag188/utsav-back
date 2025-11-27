import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { Logger } from '@config/logger'
import { KarykarmInterface, UserInterface, satsangProfileInterface } from '@interfaces/user'
import User from '@user/user.model'
import SatsangProfile from '@user/SatsangProfile.model'
import SamparkVrund from '@user/SamparkVrund.model'
import { col, fn, literal, Op, Sequelize, Transaction, where } from 'sequelize'
import Karykarm from './karykarm.model'
import FollowUp from './followUp.model'
import uploadImageToS3 from '@helpers/uploadFile'
import Seva from './Seva.model'
import SevaAllocated from './SevaAllocated.model'
import moment from 'moment'
import SocTable from './soc.model'

const USER_PUBLIC_FIELDS = [
	'email',
	'firstname',
	'lastname',
	'mobileNumber',
	'profilePic',
	'socId',
	'socName',
	'userType',
	'id',
	'active',
	'DOB',
]

const upsert = async <T>(Model: any, findWhere: object, payload: T) => {
	const existing = await Model.findOne({ where: findWhere })
	if (existing) return existing.update(payload)
	return Model.create({ ...payload, id: uuid() })
}

const safeDelete = async (Model: any, id: string, deletePayload?: object) => {
	const entity = await Model.findOne({ where: { id } })
	if (!entity) return false
	if (deletePayload) return entity.update(deletePayload)
	return entity.destroy()
}

export const upsertUser = async (payload: UserInterface) => {
	try {
		if (payload.socId === '') {
			payload.socId = null
		}
		return upsert(
			User,
			payload.id ? { id: payload.id } : { mobileNumber: payload.mobileNumber },
			payload
		)
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
	}
}

export const assignSamparkKarykar = async (payload: UserInterface) => {
	try {
		// Find the user by mobileNumber, excluding superadmin
		const user = await User.findOne({
			where: {
				mobileNumber: payload.id,
				[Op.not]: { userType: 'superadmin' },
			},
			attributes: { exclude: ['password'] },
		})

		if (!user) return false

		// Update user fields
		const updatedUser = await user.update({
			samparkVrund: payload.samparkVrund,
			active: payload.active ?? false,
			deleteReason: payload.deleteReason ?? '',
			firstname: payload.firstname ?? '',
			middlename: payload.middlename ?? '',
			lastname: payload.lastname ?? '',
			houseNumber: payload.houseNumber ?? '',
			socName: payload.socName ?? '',
			nearBy: payload.nearBy ?? '',
			area: payload.area ?? '',
		})

		return updatedUser
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const deleteUser = async (payload: any) => {
	try {
		// Find the user by ID, excluding superadmin
		const user = await User.findOne({
			where: {
				id: payload.id,
				[Op.not]: { userType: 'superadmin' },
			},
			attributes: { exclude: ['password'] },
		})

		if (!user) return false

		// Update user to mark as deleted
		const updatedUser = await user.update({
			active: payload?.active ?? false,
			deleteReason: payload.deleteReason ?? '',
		})

		return updatedUser
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const upsertSatsangProfile = async (payload: satsangProfileInterface) => {
	try {
		// Find existing profile
		const profile = await SatsangProfile.findOne({ where: { userId: payload.userId } })

		if (profile) {
			// Update existing profile
			const updatedProfile = await profile.update({ ...payload })
			return updatedProfile
		} else {
			// Create new profile
			const newProfile = await SatsangProfile.create(payload)
			return newProfile
		}
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const upsertSamparkVrund = async (payload: any) => {
	try {
		// Find existing SamparkVrund based on mandal and karykar IDs
		return await upsert(
			SamparkVrund,
			{
				mandal: payload.mandal,
				[Op.or]: [
					{ karykar1profileId: payload.karykar1profileId },
					payload.karykar2profileId && { karykar2profileId: payload.karykar2profileId },
					payload.karykar2profileId && { karykar1profileId: payload.karykar2profileId },
					{ karykar2profileId: payload.karykar1profileId },
				].filter(Boolean), // remove false entries if karykar2profileId is undefined
			},
			payload
		)
		// const existing = await SamparkVrund.findOne({
		// 	where: {
		// 		mandal: payload.mandal,
		// 		[Op.or]: [
		// 			{ karykar1profileId: payload.karykar1profileId },
		// 			payload.karykar2profileId && { karykar2profileId: payload.karykar2profileId },
		// 			payload.karykar2profileId && { karykar1profileId: payload.karykar2profileId },
		// 			{ karykar2profileId: payload.karykar1profileId },
		// 		].filter(Boolean), // remove false entries if karykar2profileId is undefined
		// 	},
		// })

		// if (existing) {
		// 	// Update existing record
		// 	const updated = await existing.update({ ...payload })
		// 	return updated
		// } else {
		// 	// Create new record
		// 	const newRecord = await SamparkVrund.create(payload)
		// 	return newRecord
		// }
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const getSamparkVrund = async (id: string, mandal: string) => {
	try {
		const vrund = await SamparkVrund.findOne({
			where: { id, mandal },
			include: [
				{
					model: SocTable,
					as: 'societies',
					attributes: ['id'],
				},
			],
		})

		return vrund || false
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const deleteSamparkVrund = async (id: string, mandal: string) => {
	try {
		// Delete SamparkVrund if it exists
		const deletedCount = await SamparkVrund.destroy({
			where: { karykar1profileId: id, mandal },
		})
		// If nothing was deleted, return false
		if (deletedCount === 0) return false

		// Update all users associated with this SamparkVrund in one query
		// await User.update(
		// 	{ samparkVrund: '' },
		// 	{
		// 		where: {
		// 			active: true,
		// 			samparkVrund,
		// 			mandal,
		// 			[Op.not]: { userType: 'superadmin' },
		// 		},
		// 	}
		// )

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
		if (!user) return null
		// if (user?.dataValues?.userType === 'karykar') {
		const samparkVrund = await SamparkVrund.findOne({
			where: {
				[Op.or]: [{ karykar1profileId: filter.id }, { karykar2profileId: filter.id }],
			},
		})
		if (samparkVrund) {
			return { ...user, samparkVrund: samparkVrund?.dataValues?.vrundName }
		}
		// }
		return user || null
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllSamparkVrund = async (mandal: string) => {
	try {
		// Fetch vrunds + related users + societies
		const vrunds = await SamparkVrund.findAll({
			where: { mandal },
			include: [
				{ model: User, as: 'karykar1profile', attributes: USER_PUBLIC_FIELDS },
				{ model: User, as: 'karykar2profile', attributes: USER_PUBLIC_FIELDS },
				{ model: SocTable, as: 'societies' },
			],
			order: [['vrundName', 'ASC']],
			raw: false,
		})

		if (vrunds.length === 0) return []

		// Convert to plain objects once
		const vrundList = vrunds.map((v) => v.get({ plain: true }))

		// Gather society IDs
		const allSocIds = new Set<number>()
		for (const v of vrundList) {
			if (!v.societies) continue
			for (const s of v.societies) allSocIds.add(s.id)
		}

		// No societies? Return early.
		if (allSocIds.size === 0) return vrundList

		const socIds = [...allSocIds]

		// Fetch all user-related data in 2 queries
		const [userCounts, allUsers] = await Promise.all([
			User.findAll({
				where: { socId: { [Op.in]: socIds }, userType: 'yuvak', active: true },
				attributes: ['socId', [fn('COUNT', col('id')), 'count']],
				group: ['socId'],
				raw: true,
			}),

			User.findAll({
				where: {
					socId: { [Op.in]: socIds },
					userType: 'yuvak',
					active: true,
				},
				attributes: USER_PUBLIC_FIELDS.concat(['socId', 'activeGroup']),
				raw: true,
			}),
		])

		/** Create lookup maps */
		const countMap = new Map<number, number>()
		for (const c of userCounts as any) {
			countMap.set(c.socId, Number(c.count))
		}

		// Separate active-group users + normal users
		const usersBySoc: Record<number, any[]> = {}
		const activeGroupList: any[] = []

		for (const u of allUsers as any) {
			if (u.activeGroup) {
				activeGroupList.push(u)
			} else {
				;(usersBySoc[u.socId] ||= []).push(u)
			}
		}

		// Add "Active" vrund only once
		vrundList.push({
			vrundName: 'Active',
			karykar1profileId: '',
			societies: [],
			userList: activeGroupList,
		})

		// Build final output
		return vrundList.map((v) => {
			const societies =
				v.societies?.map((s) => ({
					...s,
					userCount: countMap.get(s.id) || 0,
				})) || []

			// Build user list from societies
			let userList: any[] = []
			for (const s of societies) {
				if (usersBySoc[s.id]) userList.push(...usersBySoc[s.id])
			}

			// fallback to vrund.userList (for Active vrund)
			if (userList.length === 0 && v.userList) {
				userList = v.userList
			}

			return { ...v, societies, userList }
		})
	} catch (err) {
		Logger.error(err)
		return []
	}
}

export const getAllSamparkKarykar = async (mandal?: string) => {
	try {
		const karykarList = await User.findAndCountAll({
			where: {
				[Op.or]: [{ userType: 'admin' }, { userType: 'karykar' }],
				...(mandal ? { mandal } : {}),
			},
			attributes: { exclude: ['password'] },
		})

		return karykarList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getUpcomingBirthdayList = async (mandal?: string) => {
	try {
		const yuvakList = await User.findAll({
			where: {
				active: true,
				...(mandal ? { mandal } : {}),
			},
			attributes: USER_PUBLIC_FIELDS,
			order: [['DOB', 'ASC']],
			raw: true, // returns plain objects instead of model instances
		})

		if (!yuvakList.length) return []

		const today = moment().startOf('day')
		const nextWeek = moment().add(14, 'days').endOf('day')

		return yuvakList.filter((user) => {
			if (!user.DOB) return false

			const dobThisYear = moment(user.DOB).year(moment().year())
			return dobThisYear.isBetween(today, nextWeek, undefined, '[]') // inclusive
		})
	} catch (err) {
		Logger.error(err)
		return []
	}
}

export const getAllUser = async (
	offset: number,
	limit: number,
	searchTxt: string,
	orderBy: string,
	orderType: string,
	userType?: string,
	samparkVrund?: string,
	active?: boolean,
	mandal?: string
) => {
	try {
		// Base user filters
		const userWhere: any = {}
		if (active !== undefined) userWhere.active = active
		if (userType) userWhere.userType = userType
		if (mandal) userWhere.mandal = mandal
		if (samparkVrund) {
			userWhere.activeGroup = false
			userWhere.userType = 'yuvak'
		}

		// Search filter
		if (searchTxt) {
			const isMobileSearch = /^\d+$/.test(searchTxt)
			if (isMobileSearch) delete userWhere.active

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
			samparkVrund && samparkVrund !== 'NA' ? { vrundName: samparkVrund } : undefined

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
					required: !!samparkVrundWhere,
					include: [
						{
							model: SamparkVrund,
							required: !!samparkVrundWhere,
							attributes: ['id', 'vrundName'],
							where: samparkVrundWhere,
						},
					],
				},
			],
		})

		return userList
	} catch (err) {
		Logger.error(err)
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
					attributes: USER_PUBLIC_FIELDS,
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
		return userList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllKarykarm = async (mandal: string | any) => {
	try {
		const karykarmList = await Karykarm.findAll({
			order: [['createdAt', 'DESC']],
			where: {
				...(mandal && { mandal }),
			},
			attributes: {
				include: [
					[Sequelize.fn('COUNT', Sequelize.col('followUps.followUpId')), 'attendanceCount'],
				],
			},
			include: [
				{
					model: FollowUp,
					attributes: [],
					where: { attendance: true },
					required: false,
				},
			],
			group: ['Karykarm.id', 'Karykarm.karykarmId'],
		})

		return karykarmList
	} catch (err) {
		Logger.error(err)
		return null
	}
}

// export const generateKarykarmReport = async (karykarmId?: string | any) => {
// 	try {
// 		const options: any = {
// 			include: [
// 				{
// 					model: User,
// 					as: 'userData',
// 					foreignKey: 'userId',
// 					attributes: USER_PUBLIC_FIELDS,
// 					include: [
// 						{
// 							model: SocTable,
// 							as: 'society',
// 							required: false,
// 							attributes: ['id', 'socName', 'samparkVrundId'],
// 							include: [
// 								{
// 									model: SamparkVrund,
// 									as: 'samparkVrund',
// 									required: false,
// 									attributes: ['id', 'vrundName', 'karykar1profileId', 'karykar2profileId'],
// 									include: [
// 										{
// 											model: User,
// 											as: 'karykar1profile',
// 											attributes: ['id', 'firstname', 'lastname'],
// 										},
// 										{
// 											model: User,
// 											as: 'karykar2profile',
// 											attributes: ['id', 'firstname', 'lastname'],
// 										},
// 									],
// 								},
// 							],
// 						},
// 					],
// 				},
// 				{
// 					model: Karykarm,
// 					as: 'karykarmData',
// 					foreignKey: 'karykarmId',
// 					where: { ...(karykarmId && { id: karykarmId }) },
// 				},
// 			],
// 		}

// 		return await FollowUp.findAndCountAll(options)
// 	} catch (err) {
// 		Logger.error(err)
// 		return null
// 	}
// }

const isValidUUID = (id: string) => {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	return uuidRegex.test(id)
}

export const upsertKarykarm = async (payload: KarykarmInterface) => {
	if (!payload.karykarmTime) return { error: 'karykarmTime is required' }

	try {
		let existing: Karykarm | null = null

		if (payload.id && isValidUUID(payload.id)) {
			// Editing → find by ID
			existing = await Karykarm.findByPk(payload.id)
		} else {
			// Creating → check for existing entry on the same date
			const dateOnly = payload.karykarmTime.toString().split('T')[0]
			existing = await Karykarm.findOne({
				where: where(fn('DATE', col('karykarmTime')), dateOnly),
			})
			if (existing) return { error: 'Karykarm date not available' }
		}

		// Update if existing, else create new
		if (existing) return existing.update(payload)

		return Karykarm.create({ ...payload, id: uuid() })
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const getKarykarm = async (id: string) => {
	try {
		const existing = await Karykarm.findOne({ where: { id } })
		return existing
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const deleteKarykarm = async (id: string) => {
	try {
		const existing = await Karykarm.findOne({ where: { id } })
		if (!existing) return false

		// Delete associated follow-ups
		await FollowUp.destroy({ where: { karykarmId: id } })
		// Delete the Karykarm
		await Karykarm.destroy({ where: { id } })

		return true
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const followUpInitiate = async (payload: any) => {
	try {
		// Find Karykarm
		const karykarm = await Karykarm.findOne({
			where: { id: payload.id, mandal: payload.mandal },
		})

		if (!karykarm) return false

		// Update follow-up status
		await karykarm.update({ followUpStart: payload.status })

		if (payload.status === 'start') {
			// Fetch active users in the mandal
			const users = await User.findAll({
				where: {
					active: true,
					mandal: payload.mandal,
					[Op.not]: { userType: 'superadmin' },
				},
				attributes: ['id'], // fetch only required field
			})

			if (users.length) {
				const followUps = users.map((user) => ({
					id: uuid(),
					followUp: false,
					attendance: false,
					appattendance: false,
					userId: user.dataValues.id,
					karykarmId: payload.id,
					coming: false,
					how: '',
					remark: '',
				}))

				// Bulk insert follow-ups
				await FollowUp.bulkCreate(followUps)
			}
		}

		return karykarm
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
	offset: number,
	limit: number,
	searchTxt: string,
	orderBy: string,
	orderType: string,
	followUpStart: string,
	mandal: string | any,
	karykarmId: string | any
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
				...(karykarmId && { karykarmId }),
			},
			order: [['userId', 'ASC']],
			include: [
				{
					model: User,
					as: 'userData', // Ensure that 'userData' is the alias used for the User relation
					attributes: USER_PUBLIC_FIELDS, // Select only the firstname and lastname
					required: true, // Set to false if you want to include FollowUp records even if User isn't found
					where: {
						...(mandal && { mandal }),
						activeGroup: false,
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
									where: {
										...(samparkVrund && { vrundName: samparkVrund }),
									},
									attributes: ['id', 'vrundName', 'karykar1profileId', 'karykar2profileId'],
									include: [
										{
											model: User,
											as: 'karykar1profile',
											attributes: ['id', 'firstname', 'lastname'],
										},
										{
											model: User,
											as: 'karykar2profile',
											attributes: ['id', 'firstname', 'lastname'],
										},
									],
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

export const getAttendanceList = async (userId: string, mandal?: string) => {
	try {
		const followUpList = await FollowUp.findAndCountAll({
			where: { userId },
			include: [
				{
					model: User,
					as: 'userData',
					attributes: USER_PUBLIC_FIELDS,
					where: mandal ? { mandal } : undefined,
				},
				{
					model: Karykarm,
					as: 'karykarmData',
					where: mandal ? { mandal } : undefined,
				},
			],
			order: [['createdAt', 'DESC']],
		})

		return followUpList || null
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllSeva = async (userId?: string, sevaId?: string) => {
	try {
		const followUpList = await SevaAllocated.findAndCountAll({
			where: {
				...(userId && { userId }),
				...(sevaId && { sevaId }),
			},
			include: [
				{
					model: User,
					as: 'userData',
					attributes: USER_PUBLIC_FIELDS,
				},
				{
					model: Seva,
					as: 'sevaData',
					attributes: ['sevaName'],
				},
			],
			order: [['id', 'DESC']],
		})

		return followUpList || null
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getFollowUpData = async (payload: { id: string }) => {
	try {
		const followUp = await FollowUp.findOne({
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
							as: 'society',
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
				{
					model: Karykarm,
					as: 'karykarmData',
					attributes: { exclude: ['createdAt', 'updatedAt'] }, // optional, keeps consistency
				},
			],
		})

		return followUp || null
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getProfileData = async (payload: { id: string }) => {
	try {
		const profile = await User.findOne({
			where: { id: payload.id },
			attributes: { exclude: ['password'] },
			include: [
				{
					model: SocTable,
					as: 'society',
					attributes: ['socName'],
					include: [
						{
							model: SamparkVrund,
							attributes: ['vrundName'],
						},
					],
				},
				// Uncomment if you want SatsangProfile included
				// {
				//   model: SatsangProfile,
				//   as: 'satsangData',
				//   attributes: { exclude: ['createdAt', 'updatedAt'] },
				// },
			],
		})

		return profile || null
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const satsangData = async (payload: { id: string }) => {
	try {
		const profile = await SatsangProfile.findOne({ where: { userId: payload.id } })
		return profile || null
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const updateFollowUp = async (payload: any) => {
	try {
		// Find the record once
		const followUp = await FollowUp.findOne({ where: { id: payload.id } })
		if (!followUp) return false

		// Update the record
		await followUp.update({
			followUp: payload.followUp,
			coming: payload.coming,
			how: payload.how,
			remark: payload.remark,
		})

		return followUp
	} catch (error) {
		Logger.error(error)
		throw error // keep throwing to propagate errors
	}
}

export const changeAttendance = async (payload: {
	userId: string
	karykarmId: string
	attendance: boolean
	appattendance: boolean
}) => {
	try {
		const followUp = await FollowUp.findOne({
			where: { userId: payload.userId, karykarmId: payload.karykarmId },
		})

		if (!followUp) return false
		return await followUp.update({
			attendance: payload.attendance,
			appattendance: payload.appattendance,
		})
	} catch (error: any) {
		Logger.error(`Error updating attendance: ${error?.message}`)
		throw error
	}
}

export const updateBulkAttendance = async (usersList: string[], karykarmId: string) => {
	try {
		if (!usersList?.length)
			return { success: false, missingUsers: [], message: 'No users provided.' }

		// Map full names to { firstName, lastName }
		const names = usersList.map((user) => {
			const [firstName, lastName] = user.trim().split(' ')
			return { firstName, lastName }
		})

		// Fetch users matching names
		const users = await User.findAll({
			where: {
				[Op.or]: names.map((n) => ({
					firstname: { [Op.iLike]: n.firstName },
					lastname: { [Op.iLike]: n.lastName },
				})),
			},
			attributes: ['id', 'firstname', 'lastname'],
		})

		if (!users.length)
			return { success: false, missingUsers: usersList, message: 'No matching users found.' }

		const userIds = users.map((u) => u.get('id'))

		// Fetch follow-up records for these users and karykarm
		const followUps = await FollowUp.findAll({
			where: { userId: userIds, karykarmId },
			attributes: ['userId'],
		})

		const foundUserNames = followUps.map((f) => {
			const user = users.find((u) => u.get('id') === f.get('userId'))
			return `${user?.get('firstname')} ${user?.get('lastname')}`.toLowerCase()
		})

		const missingUsers = usersList.filter((u) => !foundUserNames.includes(u.toLowerCase()))

		// Bulk update attendance
		await FollowUp.update(
			{ attendance: true, appattendance: true },
			{
				where: { userId: userIds, attendance: false, karykarmId },
			}
		)

		return { success: true, missingUsers }
	} catch (error) {
		Logger.error('Error in updateBulkAttendance:', error)
		throw error
	}
}

export const login = async (filter: Partial<UserInterface>) => {
	try {
		// Find active user matching the filter
		const user = await User.findOne({ where: { ...filter, active: true } })
		return user || null
	} catch (err) {
		Logger.error('Login error:', err)
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
		Logger.error('Password verification error:', err)
		return false
	}
}

export const upsertSoc = async (payload: any) => {
	try {
		console.log(payload)
		if (payload.id) {
			// Update existing society
			const existingSoc = await SocTable.findOne({ where: { id: payload.id } })
			if (!existingSoc) return false

			await existingSoc.update({ ...payload })
			return existingSoc
		} else {
			// Check for duplicate before creating
			const duplicate = await SocTable.findOne({
				where: { socName: payload?.socName, area: payload?.area },
			})
			if (duplicate) return false

			const newSoc = await SocTable.create({ ...payload, id: uuid() })
			return newSoc
		}
	} catch (error) {
		Logger.error('Error in upsertSoc:', error)
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

export const getAllSocList = async (id?: string) => {
	try {
		const socRows = await SocTable.findAll({
			attributes: [
				'id',
				'socName',
				'area',
				[fn('COUNT', col('users.id')), 'userCount'],
				[literal('SUM(COUNT(users.id)) OVER ()'), 'totalUsers'],
				[col('samparkVrund.vrundName'), 'vrundName'],
			],
			include: [
				{
					model: User,
					attributes: [],
					required: false,
					where: { active: true, mandal: 'utsav' },
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

		const totalUsers = Number((socRows[0] as any)?.totalUsers ?? 0)

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

const normalize = (v: string | undefined) =>
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
						where(fn('LOWER', col('socName')), soc.socName?.toLowerCase()),
						where(fn('LOWER', col('area')), soc.nearBy?.toLowerCase()),
					],
				},
			})

			const userUpdatePayload = {
				socId: isExist?.dataValues?.id,
				houseNumber: soc.houseNumber?.trim(),
				socName: normalizedSocName?.trim(),
				nearBy: normalizedArea?.trim(),
				area: soc?.area?.trim(),
			}

			if (isExist) {
				if (!soc.socId?.trim()) {
					console.log(`Society exists: ${isExist.dataValues.id}, ${soc.id}`)
					await User.update(userUpdatePayload, { where: { id: soc.id } })
				}
			} else {
				const newId = uuid()
				await SocTable.create({
					id: newId,
					socName: normalizedSocName,
					area: normalizedArea,
				})
				await User.update({ ...userUpdatePayload, socId: newId }, { where: { id: soc.id } })
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
