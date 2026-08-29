import {
	Table,
	Model,
	Column,
	HasMany,
	ForeignKey,
	DataType,
	BelongsTo,
} from 'sequelize-typescript'

type UserType = import('./user.model').default

type SamparkVrundType = import('./SamparkVrund.model').default

@Table({
	timestamps: false,
	indexes: [
		{ fields: ['socName', 'area'] },
		{ fields: ['samparkVrundId'] },
	],
})
class SocTable extends Model<any, any> {
	@Column({ primaryKey: true, type: DataType.STRING })
	id!: string
	@Column
	socName!: string
	@Column
	area!: string
	// A society belongs to one SamparkVrund
	@ForeignKey(() => require('./SamparkVrund.model').default)
	@Column({
		type: DataType.STRING,
		allowNull: true,
		onDelete: 'SET NULL',
	})
	samparkVrundId!: string

	@BelongsTo(() => require('./SamparkVrund.model').default, {
		foreignKey: 'samparkVrundId',
		as: 'samparkVrund',
		onDelete: 'SET NULL',
	})
	samparkVrund!: SamparkVrundType

	@HasMany(() => require('./user.model').default, {
		foreignKey: 'socId',
		as: 'users',
	})
	users!: UserType[]
}

export default SocTable
