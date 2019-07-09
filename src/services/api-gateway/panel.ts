/*
 * panel.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import express, {Request} from 'express'
import i18n from 'i18n'
import path from 'path'
import methodOverride from 'method-override'
import chalk from 'chalk'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import applyOperatorMiddleware from './middlewares/operatorSession'
import mainRouter from './router'
import config from '~/config'

const UPLOAD_MAX_FILE_SIZE = 1000000 // 1 MB
const UPLOAD_MAX_FILES = 1

export default class ApiGateway {
	public static async initiate(url: string, port: number) {
		i18n.configure({
			defaultLocale: 'en',
			directory: path.join(__dirname, '../../constants/locales'),
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
					__dirname + '/resolvers/panel/*.resolver.*',
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
			console.info(chalk.inverse(`API Gateway opened on ${url}:${port}`))
			console.info(chalk.inverse(`Graphql listening on /pgql`))
		})
	}
}
