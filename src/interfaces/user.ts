export interface UserInterface {
	id: string
	firstname: string
	middlename: string
	lastname: string
	mobileNumber: number
	mobileUser: string
	houseNumber: string
	socName: string
	nearBy: string
	area: string
	married: boolean
	education: string
	mandal: string
	email: string
	seva: string
	sevaIntrest: string
	password: string
	userType: 'Karykar' | 'Yuvak'
	profilePic: string
	DOB: Date
	addressLine1: string
	gender: string
	// fcmToken?: string
}

export interface satsangProfileInterface {
	id: string
	yuvakProfile: string
	nityaPuja: boolean
	nityaPujaYear: number
	tilakChandlo: boolean
	tilakChandloYear: number
	satsangi: boolean
	satsangiYear: number
	athvadikSabha: boolean
	athvadikSabhaYear: number
	raviSabha: boolean
	raviSabhaYear: number
	gharSatsang: boolean
	gharSatsangYear: number
	ssp: boolean
	sspStage: string
	ekadashi: boolean
	ekadashiYear: number
	niymitVanchan: boolean
	niymitVanchanYear: number
	userId: string
}

export interface SamparkVrundInterface {
	id?: number
	karykar1profileId: string
	karykar2profileId: string
	yuvaks: string[]
}
export interface DeviceInterface {
	id: string
	userId: string
	ipAddress: string | null
	country: string | null
	city: string | null
	browserName?: string
	browserVersion?: string
	deviceVendor?: string
	deviceModel?: string
	osName?: string
	osVersion?: string
}

export interface CountriesInterface {
	id: string
	country: string
	code: string
	codeAlpha3: string
	phoneCode: string
}
