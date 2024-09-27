import { Optional } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
	Table,
	Model,
	Column,
	ForeignKey,
	DataType,
	Default,
	BelongsTo,
} from 'sequelize-typescript'

import { SevaAllocatedInterface } from '@interfaces/user'
import User from './user.model'
import Seva from './Seva.model'
interface sevaAllocatedAttributes extends Optional<SevaAllocatedInterface, 'id'> {}

@Table({ timestamps: false })
class SevaAllocated extends Model<SevaAllocatedInterface, sevaAllocatedAttributes> {
	@Default(() => uuid())
	@Column({
		primaryKey: true,
		type: DataType.STRING,
	})
	id!: string
	@ForeignKey(() => Seva)
	@Column
	sevaId!: string
	@ForeignKey(() => User)
	@Column
	userId!: string
	@BelongsTo(() => User, 'userId')
	userData!: User[]
	@BelongsTo(() => Seva, 'sevaId')
	sevaData!: Seva[]
}

export default SevaAllocated
