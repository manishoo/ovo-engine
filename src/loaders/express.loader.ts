/*
 * express.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import express from 'express'
import config from '@config'
import methodOverride from 'method-override'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'

export default ({ app }: { app: express.Application }) => {
	app.use(helmet())
	app.use(bodyParser.json({ limit: '1mb' }))
	app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
	app.use(cors())
	app.use(methodOverride())
	app.use(`/${config.uploadUrl}`, express.static(config.uploadUrl))

	return app
}
