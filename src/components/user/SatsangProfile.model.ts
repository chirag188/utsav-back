import { Optional } from 'sequelize'

import { Table, Model, Column, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { satsangProfileInterface } from '@interfaces/user'
import User from '@user/user.model'
// import { afterCreateHooks } from './hooks'
interface SatsangProfileAttributes extends Optional<satsangProfileInterface, 'id'> {}

@Table({ timestamps: true })
class SatsangProfile extends Model<satsangProfileInterface, SatsangProfileAttributes> {
	@Column({ primaryKey: true })
	id!: string
	@Column
	yuvakProfile!: string
	@Column({ defaultValue: true })
	nityaPuja!: boolean
	@Column
	nityaPujaYear!: number
	@Column({ defaultValue: true })
	tilakChandlo!: boolean
	@Column
	tilakChandloYear!: number
	@Column({ defaultValue: true })
	satsangi!: boolean
	@Column
	satsangiYear!: number
	@Column({ defaultValue: true })
	athvadikSabha!: boolean
	@Column
	athvadikSabhaYear!: number
	@Column({ defaultValue: true })
	raviSabha!: boolean
	@Column
	raviSabhaYear!: number
	@Column({ defaultValue: true })
	gharSatsang!: boolean
	@Column
	gharSatsangYear!: number
	@Column({ defaultValue: true })
	ssp!: boolean
	@Column
	sspStage!: string
	@Column({ defaultValue: true })
	ekadashi!: boolean
	@Column
	ekadashiYear!: number
	@Column({ defaultValue: true })
	niymitVanchan!: boolean
	@Column
	niymitVanchanYear!: number
	@ForeignKey(() => User)
	@Column
	userId!: string

	@BelongsTo(() => User)
	user!: User
}

export default SatsangProfile
