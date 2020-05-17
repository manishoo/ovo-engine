/*
 * graphql.loader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import FoodDataSource from '@Services/food/food.datasource'
import RecipeDataSource from '@Services/recipe/recipe.datasource'
import UserDataSource from '@Services/user/user.datasource'
import { ObjectId } from '@Types/common'
import { ObjectIdScalar } from '@Utils/scalars/object-id'
import { RedisCache } from 'apollo-server-cache-redis'
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
    dataSources: () => ({
      foods: new FoodDataSource(FoodModel as any),
      recipes: new RecipeDataSource(RecipeModel as any),
      users: new UserDataSource(UserModel as any),
    }),
    playground: process.env.NODE_ENV === 'development',
    uploads: {
      maxFileSize: config.uploads.maxFileSize,
      maxFiles: config.uploads.maxFiles
    },
    extensions: [() => new DeduplicateResponseExtension()],
    cache: new RedisCache({
      host: config.redis.host,
      port: config.redis.port ? Number(config.redis.port) : undefined,
      password: config.redis.password,
    })
  })
  graphQLAppServer.applyMiddleware({ app, path: `/${platformPath}` })
}
