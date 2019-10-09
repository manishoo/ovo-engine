/*
 * meal.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { ObjectId, Pagination, Ref, Timing, Translation, TranslationInput } from '@Types/common'
import { Food, Nutrition } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { ArrayNotEmpty, Max, Min } from 'class-validator'
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql'
import { Author } from './user'
import { Weight } from './weight'


export enum MealItemType {
  recipe = 'recipe',
  food = 'food',
}

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

@ObjectType()
export class MealItemBase {
  @Field()
  readonly id: ObjectId

  @Field()
  amount: number

  @Field(type => Food, { nullable: true })
  food?: Ref<Food>

  @Field(type => Recipe, { nullable: true })
  recipe?: Ref<Recipe>

  @Field(type => Weight, { nullable: true })
  weight?: Weight | string

  @Field({ nullable: true })
  customUnit?: string

  @Field({ nullable: true })
  gramWeight?: number

  @Field(type => [Translation], { nullable: true })
  description?: Translation[]
}

@ObjectType()
export class MealItem extends MealItemBase {
  @Field(type => [MealItemBase], { defaultValue: [] })
  alternativeMealItems: MealItemBase[]
}

@InputType()
export class MealItemInputBase {
  @Field({ defaultValue: ObjectId, nullable: true })
  readonly id?: ObjectId

  @Field()
  amount: number

  @Field(type => String, { nullable: true })
  food?: Ref<Food>

  @Field(type => String, { nullable: true })
  recipe?: Ref<Recipe>

  @Field({ nullable: true })
  weight?: string
}

@InputType()
export class MealItemInput extends MealItemInputBase {
  @Field(type => [MealItemInputBase], { defaultValue: [] })
  alternativeMealItems: MealItemInputBase[]
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

  @Field({ nullable: true })
  authorId?: string
}
