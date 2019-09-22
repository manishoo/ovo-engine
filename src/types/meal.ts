/*
 * meal.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Pagination } from '@Types/common'
import { Food, Nutrition } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { ArrayNotEmpty, Max, Min } from 'class-validator'
import mongoose from 'mongoose'
import { ArgsType, Field, InputType, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'
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
  _id?: mongoose.Schema.Types.ObjectId

  @Field()
  id?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [MealItem])
  @ArrayNotEmpty()
  items: MealItem[]

  @Field(type => Nutrition, { nullable: true })
  nutrition?: Nutrition

  @Field(type => Author)
  author: Ref<Author>
}

@InputType()
export class MealInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [MealItemInput])
  @ArrayNotEmpty()
  items: MealItemInput[]
}

@ObjectType()
export class MealItem {
  @Field()
  amount: number

  @Field(type => Food, { nullable: true })
  food?: Ref<Food>

  @Field(type => Recipe, { nullable: true })
  recipe?: Ref<Recipe>

  @Field(type => Weight, { nullable: true })
  weight?: Weight | string
}

@InputType()
export class MealItemInput {
  @Field()
  amount: number

  @Field(type => String, { nullable: true })
  food?: Ref<Food>

  @Field(type => String, { nullable: true })
  recipe?: Ref<Recipe>

  @Field({ nullable: true })
  weight?: string
}

@ArgsType()
export class ListMealsArgs {
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
