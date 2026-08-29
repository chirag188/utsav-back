import { Optional } from 'sequelize'

import {
	Table,
	Model,
	Column,
	DataType,
	AfterCreate,
	AfterUpdate,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript'

import { UserInterface } from '@interfaces/user'
import { afterCreateHooks, afterUpdateHooks } from './hooks'
import SocTable from './soc.model'

interface UserAttributes extends Optional<UserInterface, 'id'> {}

@Table({ timestamps: true })
class User extends Model<UserInterface, UserAttributes> {
	@Column({ primaryKey: true })
	id!: string
	@Column
	firstname!: string
	@Column
	middlename!: string
	@Column
	lastname!: string
	@Column({ unique: true, type: DataType.BIGINT })
	mobileNumber!: number
	@Column
	mobileUser!: string
	@Column
	userLevel!: string
	@Column
	houseNumber!: string
	@Column
	socName!: string
	@Column
	nearBy!: string
	@Column
	area!: string
	@Column({ defaultValue: false })
	married!: boolean
	@Column({ defaultValue: false })
	app!: boolean
	@Column({ defaultValue: '' })
	job!: string
	@Column({ defaultValue: '' })
	business!: string
	@Column({ defaultValue: '' })
	appId!: string
	@Column({ defaultValue: true })
	active!: boolean
	@Column
	deleteReason!: string
	@Column
	education!: string
	@Column({ defaultValue: 'UTSAV' })
	mandal!: string
	@Column({ unique: true })
	email!: string
	@Column({ defaultValue: '' })
	sevaIntrest!: string
	@Column({ defaultValue: '' })
	password!: string
	@Column({ type: DataType.INTEGER, allowNull: true })
	otpCode!: number | null
	@Column({ type: DataType.DATE, allowNull: true })
	otpExpire!: Date | null
	@Column({ type: DataType.DATE, allowNull: true })
	passwordResetExpired!: Date | null
	@Column({ type: DataType.INTEGER, defaultValue: 3, allowNull: true })
	forgotPasswordLimit!: number
	@Column({ type: DataType.DATE, allowNull: true })
	forgotPasswordBlockTime!: Date | null
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	linkSentBlocked!: boolean
	@Column({ type: DataType.INTEGER, defaultValue: 5, allowNull: true })
	otpLimit!: number
	@Column({ type: DataType.DATE, allowNull: true })
	otpBlockTime!: Date | null
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	isOTPBlocked!: boolean
	@Column({ type: DataType.INTEGER, defaultValue: 5, allowNull: true })
	loginAttempt!: number
	@Column({ type: DataType.DATE, allowNull: true })
	loginBlockedTime!: Date | null
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	isLoginBlocked!: boolean
	@Column({ type: DataType.INTEGER, defaultValue: 5, allowNull: true })
	otpMobileLimit!: number
	@Column({ type: DataType.DATE, allowNull: true })
	mobileOtpBlockTime!: Date | null
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	mobileOtpBlocked!: boolean
	@Column({ type: DataType.INTEGER, defaultValue: 3, allowNull: true })
	incorrectOtpAttempt!: number
	@Column({ type: DataType.DATE, allowNull: true })
	passwordChangedAt!: Date | null
	@Column({ type: DataType.DATE, allowNull: true })
	passwordChangeByUserTokenCreatedAt!: Date | null
	@Column
	userType!: string
	@Column({ defaultValue: false })
	activeGroup!: boolean
	@Column
	token!: string
	@Column({ defaultValue: '' })
	profilePic!: string
	@Column({ type: DataType.DATEONLY })
	DOB!: Date
	@Column({ defaultValue: 'male' })
	gender!: string
	@Column
	occupation!: string
	@Column
	occupationFiled!: string
	@Column
	fatherOccupation!: string
	@Column
	fatherOccupationFiled!: string
	@Column({ type: DataType.BIGINT })
	fatherMobileNumber!: number
	@Column
	district!: string
	@Column
	taluka!: string
	@Column
	village!: string
	@Column({ type: DataType.ARRAY(DataType.STRING) })
	sevaList!: string[]

	// Add society relation
	@ForeignKey(() => SocTable)
	@Column({
		type: DataType.STRING, // <--- ADD THIS
		allowNull: true,
	})
	socId!: string | null

	@BelongsTo(() => SocTable)
	society!: SocTable

	// Hooks
	@AfterCreate
	static beforeCreateDummyModel(instance: User) {
		afterCreateHooks(instance)
	}

	@AfterUpdate
	static updateDummyModel(instance: User) {
		afterUpdateHooks(instance)
	}
}

export default User
