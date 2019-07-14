import 'reflect-metadata'
import express, {Request} from 'express'
import i18n from 'i18n'
import path from 'path'
import methodOverride from 'method-override'
import chalk from 'chalk'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import applyUserMiddleware from '@services/api-gateway/middlewares/userSession'
import mainRouter from '@services/api-gateway/router'
import config from '@config'

global.Promise = require('bluebird')

const UPLOAD_MAX_FILE_SIZE = 2000000 // 1 MB
const UPLOAD_MAX_FILES = 1

const {appUrl: url, appPort: port} = config

async function main() {
	i18n.configure({
		defaultLocale: 'en',
		directory: path.join(__dirname, '/../../../locales'),
		updateFiles: false,
	})

	const app = express()
	app.use(helmet())
	app.use(bodyParser.json({limit: '1mb'}))
	app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}))
	app.use(methodOverride())
	app.use(`/${config.uploadUrl}`, express.static(config.uploadUrl))
	app.use(i18n.init)
	app.use(`/v1/`, mainRouter)

	/**
	 * Configure main app graphql server
	 * */
	const graphQLAppServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				__dirname + '/resolvers/*.resolver.*',
			],
		}),
		context: async ({req}: { req: Request }) => {
			const user = await applyUserMiddleware(req)

			if (!req.acceptsLanguages(['fa', 'en'])) throw new Error('Language not accepted') // FIXME

			return {
				request: req,
				user,
				lang: req.language,
			}
		},
		playground: process.env.NODE_ENV === 'development',
		uploads: {
			maxFileSize: UPLOAD_MAX_FILE_SIZE,
			maxFiles: UPLOAD_MAX_FILES
		},
	})
	graphQLAppServer.applyMiddleware({app, path: '/gql'})

	const server = require('http').Server(app)
	server.listen(port, url, () => {
		console.info(chalk.inverse(`App API Gateway opened on ${url}:${port}`))
		console.info(chalk.inverse(`Graphql listening on /gql`))
	})
}

main()

