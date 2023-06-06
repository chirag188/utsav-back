import { Optional } from 'sequelize'

import { Table, Model, Column } from 'sequelize-typescript'

import { DeviceInterface } from '@interfaces/user'

interface DeviceAttributes extends Optional<DeviceInterface, 'id'> {}

@Table({ timestamps: true })
class Device extends Model<DeviceInterface, DeviceAttributes> {
	@Column({ primaryKey: true })
	id!: string
	@Column
	userId!: string
	@Column
	ipAddress!: string
	@Column
	country!: string
	@Column
	city!: string
	@Column
	browserName!: string
	@Column
	browserVersion!: string
	@Column
	deviceVendor!: string
	@Column
	deviceModel!: string
	@Column
	osName!: string
	@Column
	osVersion!: string
}

export default Device
