/*
 * diet.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectType, Field, InputType, ArgsType } from 'type-graphql'
import { Translation, ObjectId, TranslationInput } from '@Types/common'
import { ArrayUnique, ArrayNotEmpty } from 'class-validator'


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
  @ArrayNotEmpty()
  @ArrayUnique()
  foodClassIncludes: ObjectId[]

  @Field(type => [ObjectId])
  @ArrayNotEmpty()
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
  @ArrayNotEmpty()
  @ArrayUnique()
  foodClassIncludes: ObjectId[]

  @Field(type => [ObjectId])
  @ArrayNotEmpty()
  @ArrayUnique()
  foodGroupIncludes: ObjectId[]
}

@ArgsType()
export class ListDietArgs {
  @Field({ nullable: true })
  searchSlug?: string

  @Field(type => [ObjectId], { nullable: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  searchFoodClass?: ObjectId[]

  @Field(type => [ObjectId], { nullable: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  searchFoodGroup?: ObjectId[]
}
