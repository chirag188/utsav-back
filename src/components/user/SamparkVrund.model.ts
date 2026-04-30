import { Optional } from 'sequelize'
import { Table, Model, Column, BelongsTo, ForeignKey, HasMany, DataType, BeforeCreate, BeforeUpdate } from 'sequelize-typescript'
import { SamparkVrundInterface } from '@interfaces/user'
import User from './user.model'
import SocTable from './soc.model'
interface samparkVrundAttributes extends Optional<SamparkVrundInterface, 'id'> {}

@Table({ timestamps: true })
class SamparkVrund extends Model<SamparkVrundInterface, samparkVrundAttributes> {
	@Column({ primaryKey: true })
	id?: string

	@ForeignKey(() => User)
	@Column
	karykar1profileId?: string

	@Column({ allowNull: true, type: DataType.STRING })
	karykar2profileId?: string | null

	@Column({ unique: true })
	vrundName?: string

	@Column
	mandal?: string

	@HasMany(() => SocTable, {
		onDelete: 'SET NULL', // When `SamparkVrund` is deleted, set `socId` to null instead of deleting the societies
	})
	societies!: SocTable[]

	@BelongsTo(() => User, { foreignKey: 'karykar1profileId' })
	karykar1profile!: User[]

	@BelongsTo(() => User, { foreignKey: 'karykar2profileId' })
	karykar2profile!: User[]

	@BeforeCreate
	@BeforeUpdate
	static normalizeKarykar2profileId(instance: SamparkVrund) {
		if (instance.karykar2profileId === undefined) {
			instance.karykar2profileId = null
		}
	}
}

export default SamparkVrund
