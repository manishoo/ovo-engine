/*
 * graphQLLoader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import express from 'express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { ContextFunction } from 'apollo-server-core'
import config from '@config'

const UPLOAD_MAX_FILE_SIZE = 2000000 // 1 MB
const UPLOAD_MAX_FILES = 1

export default async ({ app, resolverPath, context }: { app: express.Application, resolverPath: string, context: ContextFunction<ExpressContext> }) => {
	/**
	 * Configure main app graphql server
	 * */
	const graphQLAppServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				resolverPath,
			],
		}),
		context,
		playground: process.env.NODE_ENV === 'development',
		uploads: {
			maxFileSize: UPLOAD_MAX_FILE_SIZE,
			maxFiles: UPLOAD_MAX_FILES
		},
	})
	graphQLAppServer.applyMiddleware({ app, path: `/${config.graphQLPath}` })
}