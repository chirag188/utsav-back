import { Logger } from '@config/logger'
import Joi from 'joi'

export const registerRequest = async (data: Object) => {
	Logger.info('Inside  register request validator')

	const Schema = Joi.object({
		id: Joi.string(),
		appId: Joi.string().allow(null, ''),
		firstname: Joi.string().required(),
		middlename: Joi.string().allow(null, ''),
		lastname: Joi.string().required(),
		mobileNumber: Joi.number().required(),
		mobileUser: Joi.string().required(),
		userLevel: Joi.string(),
		houseNumber: Joi.string().allow(null, ''),
		socName: Joi.string().allow(null, ''),
		nearBy: Joi.string().allow(null, ''),
		area: Joi.string().allow(null, ''),
		married: Joi.boolean().required(),
		app: Joi.boolean().allow(false, null, ''),
		education: Joi.string().allow(null, ''),
		mandal: Joi.string().required(),
		email: Joi.string().required(),
		seva: Joi.string().allow(null, ''),
		sevaIntrest: Joi.string().allow(null, ''),
		password: Joi.string().allow(null, ''),
		userType: Joi.string().required().valid('karykar', 'yuvak', 'admin', 'superadmin'),
		profilePic: Joi.string().allow(null, ''),
		job: Joi.string().allow(null, ''),
		business: Joi.string().allow(null, ''),
		DOB: Joi.date().allow(null, ''),
		gender: Joi.string().required(),
		// username: Joi.string().required(),
		samparkVrund: Joi.string().allow(null, ''),
		occupation: Joi.string().allow(null, ''),
		occupationFiled: Joi.string().allow(null, ''),
		fatherOccupation: Joi.string().allow(null, ''),
		fatherOccupationFiled: Joi.string().allow(null, ''),
		fatherMobileNumber: Joi.number().allow(null, ''),
		district: Joi.string().allow(null, ''),
		taluka: Joi.string().allow(null, ''),
		village: Joi.string().allow(null, ''),
	})

	const validate = Schema.validate(data)
	let error = false
	let message = 'Success Validation'

	if (validate.error) {
		message = validate.error.details[0].message
		message = message.replace(/"/g, '')
		error = true
	}

	return { error, message }
}

export const satsangProfileRequest = async (data: { userId: string }) => {
	Logger.info('Inside  register request validator')

	const Schema = Joi.object({
		userId: Joi.string().required(),
		// nityaPuja: Joi.boolean(),
		// nityaPujaYear: Joi.number(),
		// tilakChandlo: Joi.boolean(),
		// tilakChandloYear: Joi.number(),
		// satsangi: Joi.boolean(),
		// satsangiYear: Joi.number(),
		// athvadikSabha: Joi.boolean(),
		// athvadikSabhaYear: Joi.number(),
		// raviSabha: Joi.boolean(),
		// raviSabhaYear: Joi.number(),
		// gharSatsang: Joi.boolean(),
		// gharSatsangYear: Joi.number(),
		// ssp: Joi.boolean(),
		// sspStage: Joi.string(),
		// ekadashi: Joi.boolean(),
		// ekadashiYear: Joi.number(),
		// niymitVanchan: Joi.boolean(),
		// niymitVanchanYear: Joi.number(),
	})

	const validate = Schema.validate(data)
	let error = false
	let message = 'Success Validation'

	if (validate.error) {
		message = validate.error.details[0].message
		message = message.replace(/"/g, '')
		error = true
	}

	return { error, message }
}

export const samparkVrundRequest = async (data: Object) => {
	Logger.info('Inside  register request validator')

	const Schema = Joi.object({
		id: Joi.string().required(),
		karykar1profile: Joi.string().required(),
		karykar2profile: Joi.string().required(),
		Yuvaks: Joi.string().required(),
		name: Joi.number().required(),
	})

	const validate = Schema.validate(data)
	let error = false
	let message = 'Success Validation'

	if (validate.error) {
		message = validate.error.details[0].message
		message = message.replace(/"/g, '')
		error = true
	}

	return { error, message }
}
// export const registerIndividualRequest = async (data: Object) => {
// 	Logger.info('Inside  register Individual request validator')

// 	const Schema = Joi.object({
// 		id: Joi.string().required(),
// 		name: Joi.string().required(),
// 		email: Joi.string().required(),
// 		country: Joi.string().required(),
// 		mobileNumber: Joi.number().required(),
// 		countryCode: Joi.string().required().messages({
// 			'any.required': 'Country code is required',
// 		}),
// 		password: Joi.string().required(),
// 		userType: Joi.string().required().valid('INVESTOR', 'PROJECT_DEVELOPER'),
// 		entityType: Joi.string().required().valid('INDIVIDUAL', 'COMPANY'),
// 		DOB: Joi.date().required(),
// 	})

// 	const validate = Schema.validate(data)
// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}

// 	return { error, message }
// }

export const loginValidation = async (
	data: Object
): Promise<{ error: boolean; message: string }> => {
	Logger.info('Inside login validator')
	const Schema = Joi.object({
		id: Joi.string().required(),
		password: Joi.string().required(),
	})
	const validate = Schema.validate(data)
	let error: boolean = false
	let message: string = ''
	if (validate.error) {
		message = validate.error.details[0].message
		message = message.replace(/"/g, '')
		error = true
	}
	return { error, message }
}

// export const verifyLoginValidation = async (payload: {
// 	countryCode: string
// 	mobileNumber: number
// 	otp: number
// 	email: string
// 	fcmToken: string
// }): Promise<{ error: boolean; message: string }> => {
// 	Logger.info('Inside verify Login validator')
// 	const Schema = Joi.object({
// 		countryCode: Joi.string().required().messages({
// 			'any.required': 'Country code is required',
// 		}),
// 		mobileNumber: Joi.number()
// 			.integer()
// 			.max(10 ** 15 - 1)
// 			.required(),
// 		otp: Joi.number().required(),
// 		email: Joi.string().email().required(),
// 		fcmToken: Joi.string().allow(''),
// 	})
// 	const validate = Schema.validate(payload)
// 	let error: boolean = false
// 	let message: string = ''
// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const mobileOtpValidation = async (payload: {
// 	countryCode: string
// 	mobileNumber: number
// }) => {
// 	Logger.info('inside mobile otp validation')

// 	const Schema = Joi.object({
// 		countryCode: Joi.string().required().messages({
// 			'any.required': 'Country code is required',
// 		}),
// 		mobileNumber: Joi.number()
// 			.integer()
// 			.max(10 ** 15 - 1)
// 			.required(),
// 		email: Joi.string().email().optional(),
// 	})
// 	const validate = Schema.validate(payload)
// 	let error: boolean = false
// 	let message: string = ''
// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const emailValidation = async (data: {
// 	email: string
// }): Promise<{ error: boolean; message: string }> => {
// 	Logger.info('inside email otp validation')
// 	const Schema = Joi.object({
// 		email: Joi.string().email().required(),
// 	})
// 	const validate = Schema.validate(data)
// 	let error: boolean = false
// 	let message: string = ''
// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }
// export const forgotPasswordValidation = async (data: Object) => {
// 	Logger.info('Inside forgot password validator')

// 	const Schema = Joi.object({
// 		email: Joi.string().required(),
// 	})

// 	const validate = Schema.validate(data)
// 	// await sendResponse(validate);
// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const resetPasswordRequest = async (data: Object) => {
// 	Logger.info('Inside reset password validator')

// 	const Schema = Joi.object({
// 		resetId: Joi.string().required(),
// 		password: Joi.string().required(),
// 	})

// 	const validate = Schema.validate(data)
// 	// await sendResponse(validate);
// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const updateUserValidation = async (data: Object) => {
// 	Logger.info('Inside update User validator')

// 	const Schema = Joi.object({
// 		companyName: Joi.string(),
// 		companyRegistrationNumber: Joi.string(),
// 		companyWebsite: Joi.string(),
// 		country: Joi.string(),
// 		state: Joi.string(),
// 		postalCode: Joi.number(),
// 		name: Joi.string(),
// 		kycStatus: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED'),
// 		DOB: Joi.date(),
// 		profilePic: Joi.string(),
// 		isPurchaser: Joi.boolean(),
// 		isBlocked: Joi.boolean(),
// 		kycVerificationId: Joi.string().allow(null),
// 		lastLogout: Joi.date(),
// 		fcmToken: Joi.string(),
// 		addressLine2: Joi.string(),
// 		firstLogin: Joi.boolean(),
// 	})

// 	const validate = Schema.validate(data)
// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}

// 	return { error, message }
// }

// export const updateEchoUserValidation = async (data: Object) => {
// 	Logger.info('Inside update Echo User validator')

// 	const Schema = Joi.object({
// 		echoStartDate: Joi.date(),
// 		echoEndDate: Joi.date(),
// 		isEchoSubscribed: Joi.boolean(),
// 		isEchoBlocked: Joi.boolean(),
// 	})

// 	const validate = Schema.validate(data)
// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}

// 	return { error, message }
// }

// export const changePasswordValidation = async (data: Object) => {
// 	Logger.info('Inside create password validator')

// 	const Schema = Joi.object({
// 		oldPassword: Joi.string().required(),
// 		newPassword: Joi.string().required(),
// 	})

// 	const validate = Schema.validate(data)
// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const createEchoUserValidation = async (data: Object) => {
// 	Logger.info('Inside create EchoUser Validatior')

// 	const Schema = Joi.object({
// 		name: Joi.string().required(),
// 		email: Joi.string().required(),
// 		echoStartDate: Joi.date(),
// 		echoEndDate: Joi.date(),
// 		isEchoSubscribed: Joi.boolean().required(),
// 	})

// 	const validate = Schema.validate(data)
// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}

// 	return { error, message }
// }

// export const priceLastUpdatedValidation = async (data: Object) => {
// 	Logger.info('Inside price Last Updated validator')

// 	const Schema = Joi.object({
// 		priceLastUpdatedAt: Joi.date(),
// 	})

// 	const validate = Schema.validate(data)
// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}

// 	return { error, message }
// }

// export const createNewUserValidator = async (data: Object) => {
// 	Logger.info('Inside create NewUser validator')

// 	const Schema = Joi.object({
// 		email: Joi.string().email().required(),
// 		password: Joi.string().required(),
// 		userType: Joi.string().valid('INVESTOR', 'PROJECT_DEVELOPER').required(),
// 	})

// 	const validate = Schema.validate(data)
// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}

// 	return { error, message }
// }
// export const twoFAUpdateRequestValidation = async (data: Object) => {
// 	Logger.info('Inside  twoFA Update Request Validation validator')

// 	const Schema = Joi.object({
// 		twoFAType: Joi.string().valid('NONE', 'AUTH', 'SMS').required(),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}

// 	return { error, message }
// }

// export const securityUpdateRequestValidation = async (data: Object) => {
// 	Logger.info('Inside  security Update Request Validation validator')

// 	const Schema = Joi.object({
// 		method: Joi.string().required().valid('NONE', 'AUTH', 'SMS'),
// 		code: Joi.number().when('method', {
// 			is: Joi.string().valid('SMS', 'AUTH'),
// 			then: Joi.number().required(),
// 			otherwise: Joi.number().forbidden(),
// 		}),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = 'Success Validation'

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const newUserloginRequestValidate = async (data) => {
// 	Logger.info('Inside new user login Request validator')
// 	const Schema = Joi.object({
// 		email: Joi.string().required(),
// 		password: Joi.string().required(),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const sendEmailValidation = async (data: Object) => {
// 	Logger.info('Inside send Email Validation validator')

// 	const Schema = Joi.object({
// 		email: Joi.string().email().required(),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const userVerifyLoginValisdation = async (data: Object) => {
// 	Logger.info('inside user verify login validator')
// 	const Schema = Joi.object({
// 		email: Joi.string().email().required(),
// 		code: Joi.number().required(),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const approveAgreementValidator = async (data: Object) => {
// 	Logger.info('inside approve Agreement Validator')
// 	const Schema = Joi.object({
// 		agreementDocId: Joi.string().required(),
// 		userAgreement: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').required(),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }

// export const approveERTCAAgreementValidator = async (data: Object) => {
// 	Logger.info('inside approve ERTCA Agreement Validator')
// 	const Schema = Joi.object({
// 		ERTCADocID: Joi.string().required(),
// 		ERTCAAgreement: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').required(),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }
// export const ertcaSignedValidation = async (data: Object) => {
// 	Logger.info('Inside send Email Validation validator')

// 	const Schema = Joi.object({
// 		ERTCADocSigned: Joi.boolean().required(),
// 	})

// 	const validate = Schema.validate(data)

// 	let error = false
// 	let message = ''

// 	if (validate.error) {
// 		message = validate.error.details[0].message
// 		message = message.replace(/"/g, '')
// 		error = true
// 	}
// 	return { error, message }
// }
