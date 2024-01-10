export interface UserInterface {
	id: string
	appId?: string
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
	app?: boolean
	active?: boolean
	deleteReason?: string
	education?: string
	mandal?: string
	email?: string
	seva?: string
	sevaIntrest?: string
	password?: string
	userType: 'karykar' | 'yuvak' | 'admin' | 'superAdmin' | 'nirikshak' | 'sanchalak'
	profilePic?: any
	DOB?: Date
	gender: string
	samparkVrund?: string
	token?: string
	job?: string
	business?: string
	occupation?: string
	occupationFiled?: string
	fatherOccupation?: string
	fatherOccupationFiled?: string
	fatherMobileNumber?: number
	district?: string
	taluka?: string
	village?: string
}

export interface satsangProfileInterface {
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
	sspYear?: number
	ekadashi?: boolean
	ekadashiYear?: number
	niymitVanchan?: boolean
	niymitVanchanYear?: number
	userId: string
}

export interface SamparkVrundInterface {
	id?: number
	karykar1profileId: string
	karykar2profileId?: string | any
	vrundName: string
	socs?: string[]
}

export interface SevaInterface {
	id: string
	sevaName: string
}
export interface SevaAllocatedInterface {
	id: string
	sevaId: string
	userId: string
}

export interface KarykarmInterface {
	id: string
	karykarmId?: number
	karykarmName?: string
	karykarmTime?: Date
	followUpStart?: string
	// followUpEnd?: boolean
	attendanceStart?: string
	// attendanceEnd?: boolean
}

export interface FollowUpInterface {
	id: string
	followUpId?: number
	followUp?: boolean
	attendance?: boolean
	appattendance?: boolean
	userId?: string
	karykarmId?: string
	coming?: boolean
	how?: string
	remark?: string
	samparkVrund?: string
}

export interface ImagesInterface {
	id: string
	imgName?: string
	imgValue?: Blob
}
