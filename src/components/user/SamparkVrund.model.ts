import { Optional } from 'sequelize'
import { Table, Model, Column, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript'
import { SamparkVrundInterface } from '@interfaces/user'
import User from './user.model'
import SocTable from './soc.model'
interface samparkVrundAttributes extends Optional<SamparkVrundInterface, 'id'> {}

@Table({ timestamps: true })
class SamparkVrund extends Model<SamparkVrundInterface, samparkVrundAttributes> {
	@Column({ primaryKey: true })
	id!: string

	@ForeignKey(() => User)
	@Column
	karykar1profileId!: string

	@ForeignKey(() => User)
	@Column
	karykar2profileId!: string

	@Column({ unique: true })
	vrundName!: string

	@Column
	mandal!: string

	@HasMany(() => SocTable, {
		onDelete: 'SET NULL', // When `SamparkVrund` is deleted, set `socId` to null instead of deleting the societies
	})
	societies!: SocTable[]

	@BelongsTo(() => User, { foreignKey: 'karykar1profileId' })
	karykar1profile!: User[]

	@BelongsTo(() => User, { foreignKey: 'karykar2profileId' })
	karykar2profile!: User[]
}

export default SamparkVrund
