import { Optional } from 'sequelize'

import {
	Table,
	Model,
	Column,
	DataType,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript'

import { FollowUpInterface } from '@interfaces/user'
import User from './user.model'
import Karykarm from './karykarm.model'
// import { afterCreateHooks } from './hooks'
interface FollowUpAttributes extends Optional<FollowUpInterface, 'id'> {}

@Table({ timestamps: true })
class FollowUp extends Model<FollowUpInterface, FollowUpAttributes> {
	@Column({ primaryKey: true })
	id!: string
	@AutoIncrement
	@Column({
		primaryKey: true,
		type: DataType.INTEGER,
	})
	followUpId!: number
	@Column
	followUp!: boolean
	@Column
	attendance!: boolean
	@ForeignKey(() => User)
	@Column
	userId!: string
	@ForeignKey(() => Karykarm)
	@Column
	karykarmId!: string
	@Column
	status!: boolean
	@Column
	coming!: boolean
	@Column
	how!: string
	@Column
	remark!: string
	@Column
	samparkVrund!: string
	@BelongsTo(() => User, 'userId')
	userData!: User[]
	@BelongsTo(() => Karykarm, 'karykarmId')
	karykarmData!: Karykarm[]
}

export default FollowUp
