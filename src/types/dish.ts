/*
 * dish.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Pagination } from '@Types/common'
import { Field, InputType, ObjectType, ArgsType } from 'type-graphql'
import { Ref } from 'typegoose'
import { Food } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { User, Author } from './user'
import { Min, Max } from 'class-validator'
import { UserSchema } from '@Models/user.model';


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
  @Field()
  id: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [DishItem])
  items: DishItem[]

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
  items: DishItemInput[]
}

@ObjectType()
export class DishItem {
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
