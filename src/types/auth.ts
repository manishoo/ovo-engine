/*
 * auth.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Operator } from '@Types/operator'
import { Field, ObjectType } from 'type-graphql'


/**
 * The information about the password that is stored in the database
 */
export class PersistedPassword {
  salt: string
  hash: string
  iterations: number
}

@ObjectType()
export class AuthResponse {
  @Field(type => Operator)
  operator: Operator
  @Field()
  session: string
}
