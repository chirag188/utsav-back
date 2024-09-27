import { Optional } from 'sequelize'

import {
	Table,
	Model,
	Column,
	BelongsTo,
	ForeignKey,
	HasMany,
	DataType,
	AutoIncrement,
} from 'sequelize-typescript'

import { SamparkVrundInterface } from '@interfaces/user'
import User from './user.model'
// import { afterCreateHooks } from './hooks'
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
	socs!: string
	@Column
	mandal!: string
	// @Column({ type: DataType.ARRAY(DataType.STRING) })
	// yuvaks!: string[]

	@BelongsTo(() => User, 'karykar1profileId')
	karykar1profile!: User[]
	@BelongsTo(() => User, 'karykar2profileId')
	karykar2profile!: User[]
	// @HasMany(() => User, 'yuvaks')
	// yuvaksList!: any[]
}

export default SamparkVrund
