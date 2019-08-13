/*
 * dish.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { Pagination } from '@Types/common'
import { MealItem } from '@Types/eating'
import { User } from '@Types/user'
import { Field, InputType, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'


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
export class DishItemInput {
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

  @Field(type => User, { nullable: true })
  author?: Ref<UserSchema> | User

  @Field(type => [MealItem])
  items: MealItem[]
}

@InputType()
export class DishInput {
  @Field()
  title: string
  // TODO complete
}
