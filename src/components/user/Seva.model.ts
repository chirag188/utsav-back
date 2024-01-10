import { Optional } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Table, Model, Column, DataType, Default, BelongsTo } from 'sequelize-typescript'

import { SevaInterface } from '@interfaces/user'
import User from './user.model'
interface sevaAttributes extends Optional<SevaInterface, 'id'> {}

@Table({ timestamps: false })
class Seva extends Model<SevaInterface, sevaAttributes> {
	@Default(() => uuid())
	@Column({
		primaryKey: true,
		type: DataType.STRING,
	})
	id!: string
	@Column
	sevaName!: string
	// @Column({ type: DataType.ARRAY(DataType.STRING) })
	// userList!: string[]
	// @BelongsTo(() => User, 'userList')
	// userData!: User[]
}

export default Seva
