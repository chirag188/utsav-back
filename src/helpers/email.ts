import sgMail, { MailDataRequired } from '@sendgrid/mail'

import Config from '@config/config'
import { Logger } from '@config/logger'

sgMail.setApiKey(Config.SENDGRID.API_KEY)

export const sendEmail = async (
	payload: {
		data: string
		email: string
		body?: string
		subject?: string
		html?: string
	},
	templateName?:
		| 'sendVerification'
		| 'sendVerficationURL'
		| 'sendEmailVerification'
		| 'sendKYBLink'
		| 'sendAgreementLink'
		| 'sendERTCALink'
		| 'sendKYBSubmitted'
		| 'sendResubmitKYB'
		| 'sendDeviceLoggedIn'
) => {
	try {
		const { body, email, subject, html, data } = payload

		const templates = {
			sendVerification: Config.SENDGRID.TEMPLATES.VERIFY_EMAIL_OTP,
			sendVerficationURL: Config.SENDGRID.TEMPLATES.RESET_PASSWORD_URL,
			sendEmailVerification: Config.SENDGRID.TEMPLATES.VERIFY_EMAIL_URL,
			sendKYBLink: Config.SENDGRID.TEMPLATES.KYB_URL,
			sendAgreementLink: Config.SENDGRID.TEMPLATES.AGREEMENT_URL,
			sendERTCALink: Config.SENDGRID.TEMPLATES.ERTCA_URL,
			sendKYBSubmitted: Config.SENDGRID.TEMPLATES.KYB_SUBMIT_URL,
			sendResubmitKYB: Config.SENDGRID.TEMPLATES.RESUBMIT_KYB_URL,
			sendDeviceLoggedIn: Config.SENDGRID.TEMPLATES.NEW_DEVICE_LOGIN_URL,
		}

		let mailOptions: MailDataRequired

		if (templateName) {
			mailOptions = {
				to: email,
				from: {
					email: Config.SENDGRID.SRC_EMAIL,
					name: 'Enverx',
				},
				templateId: templates[templateName!],
				dynamicTemplateData: { data },
			}
		} else {
			mailOptions = {
				to: email,
				from: {
					email: Config.SENDGRID.SRC_EMAIL,
					name: 'Enverx',
				},
				content: [
					{
						type: 'text',
						value: body!,
					},
				],
				subject,
				html,
			}
		}

		const [response] = await sgMail.send(mailOptions)
		Logger.info(response)
	} catch (error) {
		Logger.error(error)
		return {
			error,
		}
	}
}

export const sendMultipleEmails = async (emails: string[], templateId: string, data: any) => {
	try {
		const mailOptions = {
			to: emails,
			from: {
				email: Config.SENDGRID.SRC_EMAIL,
				name: 'Enverx',
			},
			dynamicTemplateData: { data },
			templateId,
		}
		const [response] = await sgMail.sendMultiple(mailOptions)

		Logger.info(response)
	} catch (error) {
		Logger.error(error)
		return {
			error,
		}
	}
}
