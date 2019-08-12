/*
 * express.loader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import methodOverride from 'method-override'


export default ({ app }: { app: express.Application }) => {
  app.use(helmet())
  app.use(bodyParser.json({ limit: config.bodyParserLimit }))
  app.use(bodyParser.urlencoded({ extended: false, limit: config.bodyParserUrlEncoderLimit }))
  app.use(cors())
  app.use(methodOverride())
  app.use(`/${config.uploadUrl}`, express.static(config.uploadUrl))

  return app
}
