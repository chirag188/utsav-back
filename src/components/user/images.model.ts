import { Optional } from 'sequelize'

import { Table, Model, Column, DataType, AutoIncrement } from 'sequelize-typescript'

import { ImagesInterface } from '@interfaces/user'
interface ImagesAttributes extends Optional<ImagesInterface, 'id'> {}

@Table({ timestamps: true })
class Images extends Model<ImagesInterface, ImagesAttributes> {
	@AutoIncrement
	@Column({ primaryKey: true })
	id!: number
	@Column({
		unique: true,
	})
	imgName!: string
	@Column({ type: DataType.BLOB })
	imgValue!: string
}

export default Images
