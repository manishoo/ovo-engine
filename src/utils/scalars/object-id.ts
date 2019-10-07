/*
 * object-id.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import Errors from '@Utils/errors'
import { GraphQLScalarType, Kind } from 'graphql'


export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo object id scalar type',
  parseValue(value: string) {
    return ObjectId(value) // value from the client input variables
  },
  serialize(value: ObjectId) {
    return String(value) // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (!ObjectId.isValid(ast.value)) throw new Errors.Validation('Invalid id')

      return ObjectId(ast.value) // value from the client query
    }

    return null
  },
})
