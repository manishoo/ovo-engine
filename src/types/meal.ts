/*
 * meal.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import {
  ObjectId,
  Pagination,
  Ref,
  Timing,
  Translation,
  TranslationInput
} from '@Types/common'
import { Nutrition } from '@Types/food'
import { MealItem, MealItemInput } from '@Types/ingredient'
import { ArrayNotEmpty, Max, Min } from 'class-validator'
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql'
import { Author } from './user'


@ObjectType()
export class MealListResponse {
  @Field(type => [Meal])
  meals: Meal[]
  @Field(type => Pagination)
  pagination: Pagination
}

@ObjectType()
export class Meal {
  _id?: ObjectId

  @Field()
  id?: string

  @Field(type => [Translation], { nullable: true })
  name?: Translation[]

  @Field(type => [Translation], { nullable: true })
  description?: Translation[]

  @Field(type => [MealItem])
  @ArrayNotEmpty()
  items: MealItem[]

  @Field(type => Nutrition, { nullable: true })
  nutrition?: Nutrition

  @Field(type => Author)
  author: Ref<Author>

  @Field({ nullable: true })
  likedByUser?: boolean

  @Field(type => Int)
  likesCount: number

  likes: Ref<UserSchema>[]

  @Field(type => Timing)
  timing: Timing

  @Field(type => Date)
  createdAt: Date

  @Field(type => Date)
  updatedAt?: Date

  @Field()
  instanceOf?: ObjectId
}

@InputType()
export class MealInput {
  @Field(type => [TranslationInput], { nullable: true })
  name?: TranslationInput[]

  @Field(type => [TranslationInput], { nullable: true })
  description?: TranslationInput[]

  @Field(type => [MealItemInput])
  @ArrayNotEmpty()
  items: MealItemInput[]
}

@ArgsType()
export class ListMealsArgs {
  @Field({ nullable: true })
  lastId?: string

  @Field({ nullable: true })
  @Min(1)
  page?: number

  @Field({ nullable: true })
  @Min(1)
  @Max(30)
  size?: number

  @Field(type => ObjectId, { nullable: true })
  authorId?: ObjectId
}
