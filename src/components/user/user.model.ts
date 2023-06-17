import { Optional } from 'sequelize'

import { Table, Model, Column, DataType, AfterCreate, AfterUpdate } from 'sequelize-typescript'

import { UserInterface } from '@interfaces/user'
import { afterCreateHooks, afterUpdateHooks } from './hooks'
// import BankDetails from '@user/bankDetails.model'
// import SatsangProfile from './satsangProfiles.model'

interface UserAttributes extends Optional<UserInterface, 'id'> {}

@Table({ timestamps: true })
class User extends Model<UserInterface, UserAttributes> {
	@Column({ primaryKey: true })
	id!: string
	// @Column({ unique: true })
	// username!: string
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
	@Column({ defaultValue: true })
	active!: boolean
	@Column
	activeReason!: string
	@Column
	education!: string
	@Column({ defaultValue: 'UTSAV' })
	mandal!: string
	@Column({ unique: true })
	email!: string
	@Column
	seva!: string
	@Column
	sevaIntrest!: string
	@Column({ defaultValue: 'mahant' })
	password!: string
	@Column
	userType!: string
	@Column
	samparkVrund!: string
	// @Column
	// fcmToken!: string
	@Column({ defaultValue: '' })
	profilePic!: string
	@Column({ type: DataType.DATEONLY })
	DOB!: Date
	@Column
	addressLine1!: string
	@Column({ defaultValue: 'male' })
	gender!: string

	// @HasOne(() => SatsangProfile, { onDelete: 'SET NULL' })
	// satsangProfile!: SatsangProfile

	// REFERENCE FOR ASSOCIATION
	/* @HasMany(() => Projects, 'userId')
	projects!: Projects[]

	@HasMany(() => Order, 'userId')
	orderId!: number */

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
