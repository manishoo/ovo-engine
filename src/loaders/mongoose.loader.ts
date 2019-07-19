/*
 * mongoose.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import Promise from 'bluebird'
import chalk from 'chalk'
import mongoose from 'mongoose'
// @ts-ignore
import mongooseParanoidPlugin from 'mongoose-paranoid-plugin'
import winston from 'winston'

export default () => {
	const mongooseOptions = {
		useNewUrlParser: true,
	}

	// this will add soft deleting to mongoose
	mongoose.plugin(mongooseParanoidPlugin)

	const logger = winston.createLogger({
		transports: [
			new winston.transports.Console({ level: 'debug' }),
		],
	})

	try {
		mongoose.connect(config.mongodbConnection, mongooseOptions)
	} catch (error) {
		console.log(chalk.red(error))
		console.log(chalk.yellow(`now trying to createConnection to ${config.mongodbConnection} ...`))
		mongoose.createConnection(config.mongodbConnection, mongooseOptions)
	}

	mongoose.connection.on('error', (error) => {
		console.log(chalk.red(error))
		throw new Error(`unable to connect to database: ${config.mongodbConnection}`)
	})

	mongoose.Promise = Promise

	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		mongoose.set('error', function (collectionName: any, method: any, query: any, doc: any, options: any) {
			logger.info('mongo collection: %s method: %s', collectionName, method)
		})
	}

	return mongoose
}