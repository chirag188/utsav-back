import { Request } from 'express'
import { getClientIp } from 'request-ip'
import { lookup } from 'geoip-lite'
import UAParser from 'ua-parser-js'

const deviceDetector = async (req: Request) => {
	const userAgent = req.headers['user-agent']
	if (!userAgent) return null

	const deviceData = new UAParser(userAgent).getResult()

	const { browser, os, device } = deviceData

	let ip: string | null
	let country: string | null = null
	let city: string | null = null

	ip = getClientIp(req)

	if (ip) {
		const locationData = lookup(ip)!
		country = locationData?.country
		city = locationData?.city
	}

	return {
		ipAddress: ip,
		country: country,
		city: city,
		browserName: browser.name,
		browserVersion: browser.version,
		deviceVendor: device.vendor,
		deviceModel: device.model,
		osName: os.name,
		osVersion: os.version,
	}
}

export default deviceDetector
