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
import { Op } from 'sequelize'
import Karykarm from './karykarm.model'
import FollowUp from './followUp.model'
import uploadImageToS3 from '@helpers/uploadFile'
import Seva from './Seva.model'
import SevaAllocated from './SevaAllocated.model'

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
		const isExist = await User.findOne({ where: { id: payload.id } })
		if (!isExist) return false
		// const user = await User.create(payload)
		try {
			// const image = await Images.create({ imgName: payload.id, imgValue: payload.profilePic })
			// const location = await uploadImageToS3(payload.profilePic)
			const user = await User.findOne({
				where: {
					id: payload.id,
				},
				attributes: { exclude: ['password'] },
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
			return user
		} catch (error) {
			Logger.error(error)
		}
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
							// houseNumber: payload.houseNumber,
							// socName: payload.socName,
							// nearBy: payload.nearBy,
							// area: payload.area,
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
					{
						karykar1profileId: payload.karykar1profileId,
					},
					{
						...(payload.karykar2profileId && {
							karykar2profileId: payload.karykar2profileId,
						}),
					},
					{
						...(payload.karykar2profileId && {
							karykar1profileId: payload.karykar2profileId,
						}),
					},
					{
						karykar2profileId: payload.karykar1profileId,
					},
				],
			},
		})
		if (isExist !== null) {
			return false
		}
		const samparkVrund = await SamparkVrund.create(payload)
		return samparkVrund
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const updateSamparkVrund = async (
	payload: SamparkVrundInterface,
	mandal: string,
	oldVrundName: string
) => {
	try {
		await SamparkVrund.findOne({
			where: {
				id: payload.id,
				mandal,
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
		// return samparkVrund
		const userList = await User.findAll({
			where: {
				active: true,
				samparkVrund: oldVrundName,
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
									samparkVrund: payload?.vrundName,
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
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const getSamparkVrund = async (id: string | any, mandal: string | any) => {
	try {
		const vrund = await SamparkVrund.findOne({ where: { id, mandal } })
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
		const samparkVrundList = await SamparkVrund.findAll({
			include: [
				{
					model: User,
					as: 'karykar1profile',
					foreignKey: 'karykar1profileId',
					where: {
						...(mandal && { mandal }),
					},
				},
				{
					model: User,
					as: 'karykar2profile',
					foreignKey: 'karykar2profileId',
					// where: {
					// 	...(mandal && { mandal }),
					// },
				},
			],
			where: {
				mandal,
			},
			order: [['vrundName', 'ASC']],
		})
		if (!samparkVrundList) {
			return null
		}
		const result: any = []
		try {
			await Promise.all(
				samparkVrundList?.map(async (item) => {
					const userList = await User.findAll({
						where: {
							samparkVrund: item?.dataValues?.vrundName,
							userType: 'yuvak',
							active: true,
						},
					})
					result.push({
						...item?.dataValues,
						userList,
					})
				})
			)
		} catch (error) {
			Logger.error(error)
		}
		result.sort(function (a: any, b: any) {
			return (a?.vrundName || '')?.localeCompare(b?.vrundName || '')
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
				userType: 'karykar',
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
		let options: any = {
			offset,
			...(limit !== 30 && { limit }),
			where: {
				...(userType && { userType }),
				...(mandal && { mandal }),
				...(samparkVrund && { samparkVrund: samparkVrund === 'NA' ? '' : samparkVrund }),
				active,
			},
			attributes: { exclude: ['password'] },
			order: [[orderBy, orderType]],
		}
		if (searchTxt !== '') {
			options.where = {
				...(userType && { userType }),
				...(mandal && { mandal }),
				...(samparkVrund && { samparkVrund: samparkVrund === 'NA' ? '' : samparkVrund }),
				active,
				[Op.or]: {
					firstname: {
						[Op.iLike]: `%${searchTxt}%`,
					},
					lastname: {
						[Op.iLike]: `%${searchTxt}%`,
					},
					email: {
						[Op.iLike]: `%${searchTxt}%`,
					},
				},
			}
		}

		const userList = await User.findAndCountAll({
			...options,
			attributes: { exclude: ['password'] },
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
) =>
	// userType: string | any,
	// samparkVrund: string | any,
	// active: boolean | any
	{
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
							'samparkVrund',
							'appId',
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
				// ...(userType && { userType }),
				// ...(samparkVrund && { samparkVrund }),
				...(coming && { coming: coming === 'true' }),
				...(attendance && { attendance: attendance === 'true' }),
				...(appattendance && { appattendance: appattendance === 'true' }),
				...(followUp && { followUp: followUp === 'true' }),
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
						'samparkVrund',
						'appId',
					],
					where: {
						...(mandal && { mandal }),
						...(samparkVrund && { samparkVrund }),
						...(appId === 'yes'
							? {
									appId: {
										[Op.not]: '',
									},
							  }
							: appId === 'no'
							? {
									appId: '',
							  }
							: {}),
						[Op.or]: {
							firstname: {
								[Op.iLike]: `%${searchTxt}%`,
							},
							email: {
								[Op.iLike]: `%${searchTxt}%`,
							},
							lastname: {
								[Op.iLike]: `%${searchTxt}%`,
							},
						},
					},
					...(appId === 'yes' && {
						order: [['updatedAt', 'DESC']],
					}),
				},
				{
					model: Karykarm,
					as: 'karykarmData',
					foreignKey: 'karykarmId',
					where: {
						...(mandal && { mandal }),
						...(karykarmId && { id: karykarmId }),
						...(followUpStart && { followUpStart }),
					},
				},
			],
		}
		if (searchTxt !== '') {
			options.where = {
				...(samparkVrund && { samparkVrund }),
			}
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
			where: { id: payload.id },
			include: [
				{
					model: User,
					as: 'userData',
					foreignKey: 'userId',
					attributes: ['mobileNumber', 'email', 'firstname', 'lastname', 'samparkVrund'],
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
		const isExist = await FollowUp.findOne({
			where: { userId: payload.userId, karykarmId: payload.karykarmId },
		})
		if (!isExist) return false
		try {
			const followUp = await FollowUp.findOne({
				where: { userId: payload.userId, karykarmId: payload.karykarmId },
			})
				.then((result) => {
					result!.update(
						{
							attendance: payload.attendance,
							appattendance: payload.appattendance,
						},
						{
							where: { userId: payload.userId, karykarmId: payload.karykarmId },
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
