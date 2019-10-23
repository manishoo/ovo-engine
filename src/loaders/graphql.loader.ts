/*
 * graphql.loader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { ObjectId } from '@Types/common'
import { ObjectIdScalar } from '@Utils/scalars/object-id'
import { ContextFunction } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { AuthChecker, buildSchema } from 'type-graphql'
import { Container } from 'typedi'
import { ErrorInterceptor } from '../api/common/middlewares/error-interceptor.middleware'


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
      dateScalarMode: 'isoDate',
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]
    }),
    context,
    playground: process.env.NODE_ENV === 'development',
    uploads: {
      maxFileSize: config.uploads.maxFileSize,
      maxFiles: config.uploads.maxFiles
    },
  })
  graphQLAppServer.applyMiddleware({ app, path: `/${platformPath}` })
}
