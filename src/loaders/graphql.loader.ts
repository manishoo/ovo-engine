/*
 * graphql.loader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { ObjectId } from '@Types/common'
import { ObjectIdScalar } from '@Utils/scalars/object-id'
import { ContextFunction, GraphQLExtension } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { AuthChecker, buildSchema } from 'type-graphql'
import { Container } from 'typedi'
import { ErrorInterceptor } from '../api/common/middlewares/error-interceptor.middleware'


const { deflate } = require('graphql-deduplicator')

class DeduplicateResponseExtension extends GraphQLExtension {
  public willSendResponse(o: any) {
    const { context, graphqlResponse } = o

    // Ensures `?deduplicate=1` is used in the request
    if (context.request.query.deduplicate && graphqlResponse.data && !graphqlResponse.data.__schema) {
      const data = deflate(graphqlResponse.data)
      return {
        ...o,
        graphqlResponse: {
          ...graphqlResponse,
          data,
        },
      }
    }

    return o
  }
}

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
    extensions: [() => new DeduplicateResponseExtension()],
  })
  graphQLAppServer.applyMiddleware({ app, path: `/${platformPath}` })
}
