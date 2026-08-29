import { Optional } from 'sequelize'
import { Table, Model, Column, DataType, HasMany, AutoIncrement } from 'sequelize-typescript'

import { KarykarmInterface } from '@interfaces/user'

type FollowUpType = import('./followUp.model').default

interface KarykarmAttributes extends Optional<KarykarmInterface, 'id'> {}

@Table({
	timestamps: true,
	indexes: [{ fields: ['mandal'] }, { fields: ['karykarmTime'] }, { fields: ['followUpStart'] }],
})
class Karykarm extends Model<KarykarmInterface, KarykarmAttributes> {
	@Column({ primaryKey: true })
	id!: string
	@AutoIncrement
	@Column({
		primaryKey: true,
		type: DataType.INTEGER,
	})
	karykarmId!: number
	@Column
	karykarmName!: string
	@Column({ unique: true })
	karykarmTime!: Date
	@Column
	followUpStart!: string
	@Column
	mandal!: string
	@Column
	attendanceStart!: string

	@HasMany(() => require('./followUp.model').default, {
		foreignKey: 'karykarmId',
		as: 'followUps',
	})
	followUps!: FollowUpType[]
}

export default Karykarm
