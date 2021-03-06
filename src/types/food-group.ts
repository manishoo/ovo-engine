/*
 * food-group.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translation, TranslationInput } from '@Types/common'
import mongoose from 'mongoose'
import { Field, InputType, ObjectType } from 'type-graphql'


@ObjectType()
export class ParentFoodGroup {
  @Field()
  readonly id: string
  @Field(type => [Translation])
  name: Translation[]
  @Field(type => [FoodGroup])
  subGroups: FoodGroup[]
}

@ObjectType()
export class FoodGroup {
  readonly _id: mongoose.Schema.Types.ObjectId
  @Field()
  readonly id: string
  @Field(type => [Translation])
  name: Translation[]

  parentFoodGroup?: ParentFoodGroup | mongoose.Schema.Types.ObjectId
}

@InputType()
export class FoodGroupInput {
  @Field()
  readonly id: string
  @Field(type => [TranslationInput])
  name: Translation[]
  @Field(type => [SubGroupInput])
  subGroups: SubGroupInput[]
}

@InputType()
export class SubGroupInput {
  @Field()
  readonly id: string
  @Field(type => [TranslationInput])
  name: Translation[]
}
