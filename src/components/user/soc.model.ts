import {
	Table,
	Model,
	Column,
	HasMany,
	ForeignKey,
	DataType,
	BelongsTo,
} from 'sequelize-typescript'
import User from './user.model'
import SamparkVrund from './SamparkVrund.model'

@Table({ timestamps: false })
class SocTable extends Model<any, any> {
	@Column({ primaryKey: true, type: DataType.STRING })
	id!: string
	@Column
	socName!: string
	@Column
	area!: string
	// A society belongs to one SamparkVrund
	@ForeignKey(() => SamparkVrund)
	@Column({
		type: DataType.STRING,
		allowNull: true, // This must be set to true to allow setting it to null
		onDelete: 'SET NULL',
	})
	samparkVrundId!: string

	@BelongsTo(() => SamparkVrund, {
		onDelete: 'SET NULL',
	})
	samparkVrund!: SamparkVrund

	@HasMany(() => User)
	users!: User[]
}

export default SocTable
