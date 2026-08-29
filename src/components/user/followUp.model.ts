import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { Optional } from 'sequelize'
import { FollowUpInterface } from '@interfaces/user'
import User from './user.model'
import Karykarm from './karykarm.model'
interface FollowUpAttributes extends Optional<FollowUpInterface, 'id'> {}

@Table({ timestamps: true })
class FollowUp extends Model<FollowUpInterface, FollowUpAttributes> {
	@Column({ primaryKey: true })
	id!: string

	@Column({ type: DataType.BOOLEAN })
	followUp!: boolean
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	attendance!: boolean
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	appattendance!: boolean
	@ForeignKey(() => User)
	@Column
	userId!: string
	@ForeignKey(() => Karykarm)
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

	@BelongsTo(() => User, 'userId')
	userData!: User

	@BelongsTo(() => Karykarm, 'karykarmId')
	karykarmData!: Karykarm
}

export default FollowUp
