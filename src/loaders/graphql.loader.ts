/*
 * graphQLLoader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { ContextFunction } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'

const UPLOAD_MAX_FILE_SIZE = 2000000 // 1 MB
const UPLOAD_MAX_FILES = 1

export default async ({ app, resolverPath, context }: { app: express.Application, resolverPath: string, context: ContextFunction }) => {
	/**
	 * Configure main app graphql server
	 * */
	const graphQLAppServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				resolverPath,
			],
			container: Container,
		}).catch(e => console.error(e)),
		context,
		playground: process.env.NODE_ENV === 'development',
		uploads: {
			maxFileSize: UPLOAD_MAX_FILE_SIZE,
			maxFiles: UPLOAD_MAX_FILES
		},
	})
	graphQLAppServer.applyMiddleware({ app, path: `/${config.graphQLPath}` })
}