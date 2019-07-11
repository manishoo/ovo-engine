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
import applyOperatorMiddleware from '~/services/api-gateway/middlewares/operatorSession'
import mainRouter from '~/services/api-gateway/router'
import config from '~/config'

global.Promise = require('bluebird')

const UPLOAD_MAX_FILE_SIZE = 1000000 // 1 MB
const UPLOAD_MAX_FILES = 1

const {panelUrl: url, panelPort: port} = config

async function main() {
	i18n.configure({
		defaultLocale: 'en',
		directory: path.join(__dirname, '/../../constants/locales'),
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
	 * Configure panel graphql server
	 * */
	const graphQLPanelServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				__dirname + '/../../services/api-gateway/resolvers/panel/*.resolver.*',
			]
		}),
		context: async ({req}: { req: Request }) => {
			const user = await applyOperatorMiddleware(req)
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
	graphQLPanelServer.applyMiddleware({app, path: '/pgql'})

	const server = require('http').Server(app)
	return server.listen(port, url, () => {
		console.info(chalk.inverse(`Panel API Gateway opened on ${url}:${port}`))
		console.info(chalk.inverse(`Graphql listening on /pgql`))
	})
}

main()
