/*
 * graphql.loader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { ContextFunction } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { AuthChecker, buildSchema } from 'type-graphql'
import { Container } from 'typedi'
import { ErrorInterceptor } from '../api/common/middlewares/error-interceptor.middleware'


const UPLOAD_MAX_FILE_SIZE = 2000000 // 1 MB
const UPLOAD_MAX_FILES = 1

export default async ({ app, resolverPath, context, authChecker, platformPath }: { app: express.Application, resolverPath: string, context: ContextFunction, authChecker?: AuthChecker<any>, platformPath: string }) => {
  /**
   * Configure main app graphql server
   * */
  const graphQLAppServer = new ApolloServer({
    schema: await buildSchema({
      authChecker,
      resolvers: [
        resolverPath,
        __dirname + '/../api/common/resolvers/*.resolver.*',
      ],
      container: Container,
      globalMiddlewares: [ErrorInterceptor],
      dateScalarMode: "isoDate",
    }).catch(e => console.error(e)),
    context,
    playground: process.env.NODE_ENV === 'development',
    uploads: {
      maxFileSize: UPLOAD_MAX_FILE_SIZE,
      maxFiles: UPLOAD_MAX_FILES
    },
  })
  graphQLAppServer.applyMiddleware({ app, path: `/${platformPath}` })
}
