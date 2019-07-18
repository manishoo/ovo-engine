import 'reflect-metadata' // needed for type-graphql
import express from 'express'
import chalk from 'chalk'
import config from '@config'
import expressLoader from '@loaders/express.loader'
import healthCheckLoader from '@loaders/health-check.loader'
import graphQLLoader from '@loaders/graphql.loader'
import Request = Express.Request

global.Promise = require('bluebird')

const { panelUrl: url, panelPort: port } = config

async function main() {
	const app = express()

	expressLoader({ app })
	healthCheckLoader({ app })
	await graphQLLoader({
		app,
		resolverPath: __dirname + '/resolvers/*.resolver.*',
		context: async ({ req }: { req: Request }) => {
			return {
				request: req,
				locale: req.language,
			}
		},
	})

	app.listen(port, url, () => {
		console.info(chalk.inverse(`GraphQL listening on ${url}:${port}/${config.graphQLPath}`))
	})
}

main()
