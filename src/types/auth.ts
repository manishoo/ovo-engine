/*
 * auth.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Operator } from '@Types/operator'
import { Field, Int, ObjectType } from 'type-graphql'


@ObjectType()
export class PersistedPassword {
  @Field()
  salt: string

  @Field()
  hash: string

  @Field(type => Int)
  iterations: number
}

@ObjectType()
export class AuthResponse {
  @Field(type => Operator)
  operator: Operator
  @Field()
  session: string
}
