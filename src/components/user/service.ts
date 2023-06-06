// import bcrypt from 'bcrypt'
// import { v4 as uuid } from 'uuid'
import { Logger } from '@config/logger'
import { SamparkVrundInterface, UserInterface, satsangProfileInterface } from '@interfaces/user'
// import { caxtonLoginInterface, caxtonOnboardInterface } from '@interfaces/caxton'
import User from '@user/user.model'
import SatsangProfile from '@user/SatsangProfile.model'
import SamparkVrund from '@user/SamparkVrund.model'
import { Op, Sequelize } from 'sequelize'
// import BankDetails from './bankDetails.model'
// import { Op, where } from 'sequelize'
// import crypto from 'crypto'
// import Config from '@config/config'
// import axios from 'axios'
// import Device from '@user/device.model'
// import { sumsubHelper } from '@helpers/sumsub'
// import Countries from '@user/countries.model'
// import { hash } from 'bcrypt'
// import { createSignUrl, downloadDoc } from '@helpers/helloSign'
// import { encryptCaxtonPassword, randomStringGen } from '@helpers/encryptionHelper'

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
		const isExist = await User.findOne({ where: { email: payload.email } })
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
		let result: any = []
		await Promise.all(
			user?.rows?.map(async (item) => {
				const list = await Promise.all(
					item?.dataValues?.yuvaks?.map(
						async (yuvak) => await User.findOne({ where: { id: yuvak } })
					)
				)
				result.push({ ...item?.dataValues, yuvaksList: list })
				return list
			})
		)
		return result
	} catch (err) {
		Logger.error(err)
		return null
	}
}

