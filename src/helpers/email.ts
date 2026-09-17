import sgMail from '@sendgrid/mail'

import Config from '@config/config'
import { Logger } from '@config/logger'

const apiKey = String(Config.EMAIL.PASS || '').replace(/\s+/g, '')

if (apiKey) {
	sgMail.setApiKey(apiKey)
}

export const sendEmail = async (
	payload: {
		data: string
		email: string
		body?: string
		subject?: string
		html?: string
	},
	templateName?: string
) => {
	try {
		if (!Config.EMAIL.PASS || !Config.EMAIL.FROM) {
			throw new Error('Email API configuration is missing')
		}

		const { body, email, subject, html, data } = payload

		const mailOptions = {
			from: Config.EMAIL.FROM,
			to: email,
			subject: subject || 'Notification',
			text: body || data,
			html: html || `<p>${data}</p>`,
		}

		const [response] = await sgMail.send(mailOptions)
		Logger.info('SendGrid accepted the email for delivery', {
			statusCode: response?.statusCode,
			recipient: email,
			messageId: response?.headers?.['x-message-id'],
		})
		return {
			success: true,
			accepted: true,
		}
	} catch (error) {
		Logger.error('Email send failed', error)
		return {
			error,
		}
	}
}

export const sendMultipleEmails = async (emails: string[], subject: string, body: string) => {
	try {
		if (!Config.EMAIL.PASS || !Config.EMAIL.FROM) {
			throw new Error('Email API configuration is missing')
		}

		const response = await sgMail.send(
			emails.map((email) => ({
				from: Config.EMAIL.FROM,
				to: email,
				subject,
				text: body,
			}))
		)

		Logger.info('SendGrid accepted bulk email for delivery', {
			count: response.length,
			recipients: emails,
		})
		return {
			success: true,
			accepted: true,
		}
	} catch (error) {
		Logger.error('Bulk email send failed', error)
		return {
			error,
		}
	}
}
