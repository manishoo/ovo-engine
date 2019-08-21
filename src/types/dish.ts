/*
 * dish.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Pagination } from '@Types/common'
import { Field, InputType, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'
import { Food } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { Weight, WeightInput } from './weight';


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

@InputType()
export class DishItemInputs {
  @Field({ nullable: true })
  unit?: string
  @Field()
  amount: number
  @Field()
  foodId?: string
}

@ObjectType()
export class Dish {
  @Field()
  id: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [DishItem])
  items: DishItem[]
}

@InputType()
export class DishInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [DishItemInput])
  items: DishItemInput[]
}

@ObjectType()
export class DishItem {
  @Field()
  unit: number

  @Field(type => String, { nullable: true })
  food?: Ref<Food>

  @Field(type => String, { nullable: true })
  recipe?: Ref<Recipe>

  @Field({ nullable: true })
  weight: string
}

@InputType()
export class DishItemInput {
  @Field()
  unit: number

  @Field(type => String, { nullable: true })
  food?: Ref<Food>

  @Field(type => String, { nullable: true })
  recipe?: Ref<Recipe>

  @Field({ nullable: true })
  weight: string
}