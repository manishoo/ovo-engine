/*
 * dish.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Pagination } from '@Types/common'
import { Field, InputType, ObjectType, ArgsType } from 'type-graphql'
import { Ref } from 'typegoose'
import { Food, Nutrition } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { Author } from './user'
import { Min, Max, ArrayNotEmpty } from 'class-validator'
import mongoose from 'mongoose'
import { Weight } from './weight'


export enum DISH_ITEM_TYPES {
  recipe = 'recipe',
  food = 'food',
}

@ObjectType()
export class DishListResponse {
  @Field(type => [Dish])
  dishes: Dish[]
  @Field(type => Pagination)
  pagination: Pagination
}

@ObjectType()
export class Dish {
  _id?: mongoose.Schema.Types.ObjectId
  @Field()
  id?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [DishItem])
  @ArrayNotEmpty()
  items: DishItem[]

  @Field(type => Nutrition, { nullable: true })
  nutrition?: Nutrition

  @Field(type => Author)
  author: Ref<Author>
}

@InputType()
export class DishInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [DishItemInput])
  @ArrayNotEmpty()
  items: DishItemInput[]
}

@ObjectType()
export class DishItem {
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
export class DishItemInput {
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
export class ListDishesArgs {
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
