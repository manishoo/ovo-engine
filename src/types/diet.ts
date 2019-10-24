/*
 * diet.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectType, Field, InputType } from 'type-graphql'
import { Translation, ObjectId, TranslationInput } from '@Types/common'
import { ArrayUnique } from 'class-validator'


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
  @ArrayUnique()
  foodClassIncludes: ObjectId[]

  @Field(type => [ObjectId])
  @ArrayUnique()
  foodGroupIncludes: ObjectId[]
}

@InputType()
export class DietInput {
  @Field(type => [TranslationInput])
  name: TranslationInput[]

  @Field()
  slug: string

  @Field(type => [ObjectId])
  @ArrayUnique()
  foodClassIncludes: ObjectId[]

  @Field(type => [ObjectId])
  @ArrayUnique()
  foodGroupIncludes: ObjectId[]
}

@InputType()
export class ListDietInput {
  @Field({ nullable: true })
  searchSlug?: string

  @Field(type => [ObjectId], { nullable: true })
  searchFoodClass?: ObjectId[]

  @Field(type => [ObjectId], { nullable: true })
  searchFoodGroup?: ObjectId[]
}
