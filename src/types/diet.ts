/*
 * diet.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectType, Field, InputType } from 'type-graphql'
import { Translation, ObjectId, TranslationInput } from '@Types/common'


@ObjectType()
export class Diet {
  readonly _id: ObjectId
  @Field()
  readonly id: string

  @Field(type => [Translation])
  name: Translation[]

  @Field()
  slug: string

  @Field(type => [ObjectId])
  foodClassIncludes: ObjectId[]

  @Field(type => [ObjectId])
  foodGroupIncludes: ObjectId[]
}

@InputType()
export class DietInput {
  @Field(type => [TranslationInput])
  name: TranslationInput[]

  @Field()
  slug: string

  @Field(type => [String])
  foodClassIncludes: string[]

  @Field(type => [String])
  foodGroupIncludes: string[]
}
