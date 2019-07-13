/*
 * sequelize.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@config'
import Sequelize from 'sequelize'

const main = new Sequelize(config.mysql.db, config.mysql.user, config.mysql.pass, {
	host: config.mysql.host,
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
})

const fnddsConnection = new Sequelize('fndds', config.mysql.user, config.mysql.pass, {
	host: config.mysql.host,
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
})

const foodbConnection = new Sequelize('foodb', config.mysql.user, config.mysql.pass, {
	host: config.mysql.host,
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
})

export {
	fnddsConnection as fndds,
	foodbConnection as foodb,
	main,
	Sequelize,
}
