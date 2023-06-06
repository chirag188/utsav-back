import crypto from 'crypto'

export const encryptCaxtonPassword = async (password: string) => {
	const hash = crypto.createHash('md5')
	const passwordBytes = Buffer.from(password, 'utf8')
	const hashedPassword = hash.update(passwordBytes).digest()
	const finalData = hashedPassword.toString('base64')

	return finalData
}

export const randomStringGen = async (
	type: 'AlphaNumeric' | 'Password' | 'Alphabet',
	length: number = 10
) => {
	const charType = {
		AlphaNumeric: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		Password: '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		Alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	}

	const chars = charType[type]
	const loopLength = type === 'Password' ? length - 3 : length
	let randomString = ''

	for (let i = 0; i <= loopLength; i++) {
		let randomNumber = Math.floor(Math.random() * chars.length)
		randomString += chars.substring(randomNumber, randomNumber + 1)
	}

	if (type === 'Password') {
		const paswordChars = ['0123456789', '!@#$%^&*()', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']

		paswordChars.map((chars) => {
			let randomNumber = Math.floor(Math.random() * chars.length)
			randomString += chars.substring(randomNumber, randomNumber + 1)
		})
	}

	return randomString
}
