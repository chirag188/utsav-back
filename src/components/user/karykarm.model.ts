import { Optional } from 'sequelize'
import { Table, Model, Column, DataType, AutoIncrement, HasMany } from 'sequelize-typescript'

import { KarykarmInterface } from '@interfaces/user'
interface KarykarmAttributes extends Optional<KarykarmInterface, 'id'> {}

@Table({ timestamps: true })
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

	// KEEP RELATION — this works without import
	@HasMany(() => require('./followUp.model').default, 'karykarmId')
	followUps!: ReturnType<typeof require>[]
}

export default Karykarm
