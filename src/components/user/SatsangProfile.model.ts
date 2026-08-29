import { Optional } from 'sequelize'

import { Table, Model, Column, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { satsangProfileInterface } from '@interfaces/user'
import User from '@user/user.model'
// import { afterCreateHooks } from './hooks'
interface SatsangProfileAttributes extends Optional<satsangProfileInterface, 'userId'> {}

@Table({ timestamps: true })
class SatsangProfile extends Model<satsangProfileInterface, SatsangProfileAttributes> {
	@ForeignKey(() => User)
	@Column({ primaryKey: true })
	userId!: string
	@Column({ defaultValue: false })
	nityaPuja!: boolean
	@Column
	nityaPujaYear!: number
	@Column({ defaultValue: false })
	tilakChandlo!: boolean
	@Column
	tilakChandloYear!: number
	@Column({ defaultValue: false })
	satsangi!: boolean
	@Column
	satsangiYear!: number
	@Column({ defaultValue: false })
	athvadikSabha!: boolean
	@Column
	athvadikSabhaYear!: number
	@Column({ defaultValue: false })
	raviSabha!: boolean
	@Column
	raviSabhaYear!: number
	@Column({ defaultValue: false })
	gharSatsang!: boolean
	@Column
	gharSatsangYear!: number
	@Column({ defaultValue: false })
	ssp!: boolean
	@Column
	sspStage!: string
	@Column
	sspYear!: number
	@Column({ defaultValue: false })
	ekadashi!: boolean
	@Column
	ekadashiYear!: number
	@Column({ defaultValue: false })
	niymitVanchan!: boolean
	@Column
	niymitVanchanYear!: number

	@BelongsTo(() => User)
	user!: User
}

export default SatsangProfile
