import { Optional } from 'sequelize'

import { Table, Model, Column, DataType, AfterCreate, AfterUpdate, ForeignKey, BelongsToMany, HasMany } from 'sequelize-typescript'

import { UserInterface } from '@interfaces/user'
import { afterCreateHooks, afterUpdateHooks } from './hooks'

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
	@Column({ defaultValue: '1234' })
	password!: string
	@Column
	userType!: string
	@Column
	samparkVrund!: string
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
