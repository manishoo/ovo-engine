import config from '@Config'
import expressLoader from '@Loaders/express.loader'
import graphQLLoader from '@Loaders/graphql.loader'
import healthCheckLoader from '@Loaders/health-check.loader'
import chalk from 'chalk'
import express, { Request } from 'express'
import 'reflect-metadata' // needed for type-graphql
import userMiddleware from './middlewares/user.middleware'

global.Promise = require('bluebird')

const { appUrl: url, appPort: port } = config

async function main() {
	const app = express()

	expressLoader({ app })
	healthCheckLoader({ app })
	await graphQLLoader({
		app,
		resolverPath: __dirname + '/resolvers/*.resolver.*',
		context: async ({ req }: { req: Request }) => {
			const user = await userMiddleware(req)

			return {
				request: req,
				user,
				locale: req.language,
			}
		},
	})

	app.listen(port, url, () => {
		console.info(chalk.inverse(`GraphQL listening on ${url}:${port}/${config.graphQLPath}`))
	})
}

main()

