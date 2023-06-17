export interface UserInterface {
	id: string
	// username?: string
	firstname: string
	middlename?: string
	lastname: string
	mobileNumber: number
	mobileUser?: string
	houseNumber?: string
	socName?: string
	nearBy?: string
	area?: string
	married?: boolean
	education?: string
	mandal?: string
	email?: string
	seva?: string
	sevaIntrest?: string
	password?: string
	userType: 'karykar' | 'yuvak' | 'nirikshak' | 'sanchalak'
	profilePic?: string
	DOB?: Date
	addressLine1?: string
	gender: string
	samparkVrund?: string
	// fcmToken?: string
}

export interface satsangProfileInterface {
	id: string
	yuvakProfile?: string
	nityaPuja?: boolean
	nityaPujaYear?: number
	tilakChandlo?: boolean
	tilakChandloYear?: number
	satsangi?: boolean
	satsangiYear?: number
	athvadikSabha?: boolean
	athvadikSabhaYear?: number
	raviSabha?: boolean
	raviSabhaYear?: number
	gharSatsang?: boolean
	gharSatsangYear?: number
	ssp?: boolean
	sspStage?: string
	ekadashi?: boolean
	ekadashiYear?: number
	niymitVanchan?: boolean
	niymitVanchanYear?: number
	userId: string
}

export interface SamparkVrundInterface {
	id?: number
	karykar1profileId: string
	karykar2profileId?: string
	vrundName: string
	socs?: string[]
}

export interface KarykarmInterface {
	id: string
	karykarmId?: number
	karykarmName?: string
	karykarmTime?: Date
	followUpStart?: boolean
	followUpEnd?: boolean
	attendanceStart?: boolean
	attendanceEnd?: boolean
}

export interface FollowUpInterface {
	id: string
	followUpId?: number
	followUp: boolean
	attendance: boolean
	userId: string
	karykarmId: string
}
