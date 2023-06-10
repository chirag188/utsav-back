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
	Logger.info('Inside create User service')
	try {
		const isExist = await User.findOne({ where: { email: payload.email } })
		if (isExist) return false
		const user = await User.create(payload)
		return user
	} catch (error) {
		Logger.error(error)
		throw error
	}
}

export const updateUser = async (payload: UserInterface) => {
	Logger.info('Inside Update User service')
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
	Logger.info('Inside create SatsangProfile service')
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
	Logger.info('Inside Update SatsangProfile service')
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
	Logger.info('Inside create SamparkVrund service')
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
	Logger.info('Inside Get User Service')
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

export const getAllSamparkVrund = async (filter: Partial<SamparkVrundInterface>) => {
	Logger.info('Inside Get User Service')
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

export const createKarykarm = async (payload: KarykarmInterface) => {
	Logger.info('Inside create User service')
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
	Logger.info('Inside create User service')
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

export const followUpInitiate = async (payload: KarykarmInterface) => {
	Logger.info('Inside create User service')
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
							followUpStart: true,
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
			// if (karykarm) {
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
						})
				)
			)
			// }
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
	Logger.info('Inside Get User Service')
	try {
		const followUpList = await FollowUp.findAndCountAll({
			include: [
				{
					model: User,
					as: 'userData',
					foreignKey: 'userId',
					attributes: ['mobileNumber', 'email'],
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
