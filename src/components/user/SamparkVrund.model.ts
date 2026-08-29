import { Optional } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { Table, Model, Column, BelongsTo, ForeignKey, HasMany, DataType, BeforeCreate, BeforeUpdate, Default } from 'sequelize-typescript'
import { SamparkVrundInterface } from '@interfaces/user'

type UserType = import('./user.model').default
type SocTableType = import('./soc.model').default

interface samparkVrundAttributes extends Optional<SamparkVrundInterface, 'id'> {}

@Table({
	timestamps: true,
	indexes: [
		{ fields: ['mandal', 'vrundName'] },
		{ fields: ['karykar1profileId'] },
		{ fields: ['karykar2profileId'] },
		{ fields: ['karykar3profileId'] },
	],
})
class SamparkVrund extends Model<SamparkVrundInterface, samparkVrundAttributes> {
	@Default(() => uuid())
	@Column({ primaryKey: true, type: DataType.STRING })
	id?: string

	@ForeignKey(() => require('./user.model').default)
	@Column
	karykar1profileId?: string

	@ForeignKey(() => require('./user.model').default)
	@Column({ allowNull: true, type: DataType.STRING })
	karykar2profileId?: string | null

	@ForeignKey(() => require('./user.model').default)
	@Column({ allowNull: true, type: DataType.STRING })
	karykar3profileId?: string | null

	@Column({ unique: true })
	vrundName?: string

	@Column
	mandal?: string

	@HasMany(() => require('./soc.model').default, {
		foreignKey: 'samparkVrundId',
		as: 'societies',
		onDelete: 'SET NULL',
	})
	societies!: SocTableType[]

	@BelongsTo(() => require('./user.model').default, { foreignKey: 'karykar1profileId', as: 'karykar1profile' })
	karykar1profile!: UserType

	@BelongsTo(() => require('./user.model').default, { foreignKey: 'karykar2profileId', as: 'karykar2profile' })
	karykar2profile!: UserType

	@BelongsTo(() => require('./user.model').default, { foreignKey: 'karykar3profileId', as: 'karykar3profile' })
	karykar3profile!: UserType

	@BeforeCreate
	@BeforeUpdate
	static normalizeCoordinatorIds(instance: SamparkVrund) {
		// Normalize optional coordinator IDs to null if undefined or empty
		if (instance.karykar2profileId === undefined || instance.karykar2profileId === '') {
			instance.karykar2profileId = null
		}
		if (instance.karykar3profileId === undefined || instance.karykar3profileId === '') {
			instance.karykar3profileId = null
		}
	}
}

export default SamparkVrund
