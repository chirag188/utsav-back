import { Optional } from 'sequelize'

import { Table, Model, Column, AutoIncrement, DataType, HasMany } from 'sequelize-typescript'

import { KarykarmInterface } from '@interfaces/user'
import FollowUp from './followUp.model'
// import { afterCreateHooks } from './hooks'
interface KarykarmAttributes extends Optional<KarykarmInterface, 'id'> {}

@Table({ timestamps: true })
class Karykarm extends Model<KarykarmInterface, KarykarmAttributes> {
	// @AutoIncrement
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
	// @Column
	// followUpEnd!: boolean
	@Column
	attendanceStart!: string
	// @Column
	// attendanceEnd!: boolean

	@HasMany(() => FollowUp, 'karykarmId')
	followUps!: FollowUp[]
}

export default Karykarm
