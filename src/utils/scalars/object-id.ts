/*
 * objectid.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { GraphQLScalarType, Kind } from 'graphql'
import mongoose from 'mongoose'
import Errors from '@Utils/errors'


export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo object id scalar type',
  parseValue(value: string) {
    //return new ObjectId(value) // value from the client input variables

    return mongoose.Types.ObjectId(value)
  },
  serialize(value: mongoose.Types.ObjectId) {
    return value // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      //return new ObjectId(ast.value) // value from the client query

      if (!mongoose.Types.ObjectId.isValid(ast.value)) throw new Errors.Validation('Invalid id')

      return mongoose.Types.ObjectId(ast.value)
    }

    return null
  },
})
