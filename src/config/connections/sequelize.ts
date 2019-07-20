/*
 * sequelize.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { Sequelize } from 'sequelize'

export default new Sequelize(config.mysql.db, config.mysql.user, config.mysql.pass, {
	host: config.mysql.host,
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
})
