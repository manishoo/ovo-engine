/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import 'reflect-metadata'
import config from './config'
import Promise from 'bluebird'
import ApiGateway from '~/services/api-gateway'
import {logError} from './utils/logger'
import mkdirp from 'mkdirp'
import {Services} from '~/constants/enums'

const argv = require('minimist')(process.argv.slice(2))

mkdirp.sync(config.uploadUrl)
mkdirp.sync(config.uploadUrl + '/foods')
mkdirp.sync(config.uploadUrl + '/recipes')
mkdirp.sync(config.uploadUrl + '/food_icons_v1')
global.Promise = Promise

if (!argv.m) {
	console.error('You must specify a module, either panel or app. e.g -m app OR -m panel OR -m panel -m app')
	process.exit(1)
}

const panelKey = 'panel'
const appKey = 'app'

const services: Services[] = []
const isPanel = typeof argv.m === 'string' ? (argv.m === panelKey) : (argv.m.find((p: string) => p === panelKey))
if (isPanel) services.push(Services.panel)
const isApp = typeof argv.m === 'string' ? (argv.m === appKey) : (argv.m.find((p: string) => p === appKey))
if (isApp) services.push(Services.app)

ApiGateway.initiate(services)
	.catch((e: Error) => {
		logError('apiGatewayInstance.initiate')(e)
		throw e
	})