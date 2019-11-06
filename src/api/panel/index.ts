/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import expressLoader from '@Loaders/express.loader'
import graphQLLoader from '@Loaders/graphql.loader'
import healthCheckLoader from '@Loaders/health-check.loader'
import i18nLoader from '@Loaders/i18n.loader'
import { authChecker } from '@Utils/authChecker'
import getLocaleFromRequest from '@Utils/get-locale-from-request'
import chalk from 'chalk'
import express, { Request } from 'express'
import 'reflect-metadata' // needed for type-graphql
import operatorMiddleware from './middlewares/operator.middleware'


global.Promise = require('bluebird')

const { panelUrl: url, panelPort: port } = config

async function main() {
  const app = express()

  expressLoader({ app })
  healthCheckLoader({ app })
  i18nLoader({ app })
  await graphQLLoader({
    app,
    resolverPath: __dirname + '/resolvers/*.resolver.*',
    authChecker,
    platformPath: config.graphQLPath_PANEL,
    context: async ({ req }: { req: Request }) => {
      const user = await operatorMiddleware(req)

      return {
        request: req,
        user,
        lang: getLocaleFromRequest(req),
      }
    },
  })

  app.listen(port, url, () => {
    console.info(chalk.inverse(`GraphQL listening on ${url}:${port}/${config.graphQLPath_PANEL}`))
  })
}

main()

