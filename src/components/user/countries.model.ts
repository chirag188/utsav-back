import { Optional } from 'sequelize'
import { Table, Model, Column } from 'sequelize-typescript'

import { CountriesInterface } from '@interfaces/user'

interface CountriesAttributes extends Optional<CountriesInterface, 'id'> {}

@Table({ timestamps: true })
class Countries extends Model<CountriesInterface, CountriesAttributes> {
	@Column
	country!: string
	@Column
	code!: string
	@Column
	codeAlpha3!: string
	@Column
	phoneCode!: string
}

export default Countries
