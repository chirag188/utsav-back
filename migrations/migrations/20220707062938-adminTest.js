'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn("SamparkVrund", "karykar1profile", "karykar1profileId")
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		/* await queryInterface.addColumn('Users', 'testCol', {
			type: Sequelize.STRING,
			defaultValue: 'test',
		}) */
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.dropTable('SequelizeMeta')
	},
}
