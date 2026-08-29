import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { Optional } from 'sequelize'
import { FollowUpInterface } from '@interfaces/user'

type UserType = import('./user.model').default
type KarykarmType = import('./karykarm.model').default

interface FollowUpAttributes extends Optional<FollowUpInterface, 'id'> {}

@Table({
	timestamps: true,
	indexes: [
		{ fields: ['userId', 'karykarmId'] },
		{ fields: ['karykarmId', 'attendance'] },
		{ fields: ['userId', 'attendance'] },
		{ fields: ['attendance', 'appattendance'] },
	],
})
class FollowUp extends Model<FollowUpInterface, FollowUpAttributes> {
	@Column({ primaryKey: true })
	id!: string

	@Column({ type: DataType.BOOLEAN })
	followUp!: boolean
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	attendance!: boolean
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	appattendance!: boolean
	@ForeignKey(() => require('./user.model').default)
	@Column
	userId!: string
	@ForeignKey(() => require('./karykarm.model').default)
	@Column
	karykarmId!: string
	@Column({ type: DataType.BOOLEAN })
	status!: boolean
	@Column({ type: DataType.BOOLEAN })
	coming!: boolean

	@Column({ type: DataType.STRING })
	how!: string

	@Column({ type: DataType.STRING })
	remark!: string

	@BelongsTo(() => require('./user.model').default, {
		foreignKey: 'userId',
		as: 'userData',
	})
	userData!: UserType

	@BelongsTo(() => require('./karykarm.model').default, {
		foreignKey: 'karykarmId',
		as: 'karykarmData',
	})
	karykarmData!: KarykarmType
}

export default FollowUp
