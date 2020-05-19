/*
 * mongoose.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import chalk from 'chalk'
import mongoose from 'mongoose'
// @ts-ignore
import mongooseParanoidPlugin from 'mongoose-paranoid-plugin'
import winston from 'winston'

// this will add soft deleting to mongoose
mongoose.plugin(mongooseParanoidPlugin)

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'debug' }),
  ],
})

const mongooseOptions = {
  useNewUrlParser: true,
}

try {
  mongoose.connect(config.mongodbConnection, mongooseOptions)
} catch (error) {
  console.log(chalk.red(error))
  console.log(chalk.yellow(`now trying to createConnection to ${config.mongodbConnection} ...`))
  mongoose.createConnection(config.mongodbConnection, mongooseOptions)
}

mongoose.connection.on('error', (error) => {
  // console.log(error);
  console.log(chalk.red(error))
  throw new Error(`unable to connect to database: ${config.mongodbConnection}`)
})

mongoose.Promise = require('bluebird')

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // mongoose.set('debug', true)
}

export default mongoose
