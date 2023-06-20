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

export const updateUser = async (payload: UserInterface) => {
	try {
		const isExist = await User.findOne({ where: { id: payload.id } })
		if (!isExist) return false
		// const user = await User.create(payload)
		try {
			const user = await User.findOne({
				where: {
					email: payload.email,
				},
			})
				.then((result) => {
					result!.update(
						{
							...payload,
						},
						{
							where: {
								email: payload.email,
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
				[Op.or]: [
					{
						karykar1profileId: payload.karykar1profileId,
					},
					{
						karykar2profileId: payload.karykar2profileId,
					},
					{
						karykar1profileId: payload.karykar2profileId,
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

export const getUserService = async (filter: Partial<UserInterface>) => {
	try {
		const user = await User.findOne({ where: filter, raw: true })
		if (!user) {
			return null
		}
		return user
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllSamparkVrund = async (filter: Partial<SamparkVrundInterface>) => {
	try {
		const user = await SamparkVrund.findAndCountAll({
			include: [
				{ model: User, as: 'karykar1profile', foreignKey: 'karykar1profileId' },
				{ model: User, as: 'karykar2profile', foreignKey: 'karykar2profileId' },
			],
		})
		if (!user) {
			return null
		}
		// let result: any = []
		// await Promise.all(
		// 	user?.rows?.map(async (item) => {
		// 		const list = await Promise.all(
		// 			item?.dataValues?.yuvaks?.map(
		// 				async (yuvak) => await User.findOne({ where: { id: yuvak } })
		// 			)
		// 		)
		// 		result.push({ ...item?.dataValues, yuvaksList: list })
		// 		return list
		// 	})
		// )
		return user
	} catch (err) {
		Logger.error(err)
		return null
	}
}

export const getAllSamparkKarykar = async (filter: Partial<User>) => {
	try {
		const karykarList = await User.findAndCountAll({
			where: {
				userType: 'karykar',
			},
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
	userType: string | any,
	samparkVrund: string | any,
	active: boolean | any
) => {
	try {
		const userList = await User.findAndCountAll({
			where: {
				...(userType && { userType }),
				...(samparkVrund && { samparkVrund }),
				active,
			},
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

export const getAllKarykarm = async () =>
	// userType: string | any,
	// samparkVrund: string | any,
	// active: boolean | any
	{
		try {
			const karykarmList = await Karykarm.findAndCountAll({
				// where: {
				// 	...(userType && { userType }),
				// 	...(samparkVrund && { samparkVrund }),
				// 	active,
				// },
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
							},
						}
					)
				})
				.catch((error) => {
					Logger.error(error)
					return null
				})
			if (payload.status === 'start') {
				const userList = await User.findAll()
				await Promise.all(
					userList?.map(
						async (item) =>
							await FollowUp.create({
								id: uuid(),
								followUp: false,
								attendance: false,
								userId: item?.dataValues?.id,
								karykarmId: payload.id,
								coming: false,
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

export const getFollowUpList = async () => {
	try {
		const followUpList = await FollowUp.findAndCountAll({
			include: [
				{
					model: User,
					as: 'userData',
					foreignKey: 'userId',
					attributes: ['mobileNumber', 'email', 'firstname', 'lastname'],
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

export const getAttendanceList = async (userId: string) => {
	try {
		const followUpList = await FollowUp.findAndCountAll({
			where: { userId },
			include: [
				// {
				// 	model: User,
				// 	as: 'userData',
				// 	foreignKey: 'userId',
				// 	attributes: ['mobileNumber', 'email', 'firstname', 'lastname'],
				// },
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

export const login = async (filter: Partial<UserInterface>) => {
	try {
		const user = await User.findOne({ where: filter })
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
