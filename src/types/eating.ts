/*
 * eating.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Field, ObjectType, InputType, ID, Int } from 'type-graphql'
import { MealType, Image } from '@Types/common'
import { DishItem, DishItemInput } from '@Types/dish'
import { ArrayNotEmpty } from 'class-validator'
import { Weight } from './weight';
import { Nutrition } from './food';
import { prop } from 'typegoose';


@ObjectType()
export class Meal {
  @Field(type => MealType)
  type: MealType

  @Field({ nullable: true })
  time?: Date

  @Field(type => [DishItem])
  @ArrayNotEmpty()
  items: DishItem[]
}

@InputType()
export class MealInput {
  @Field(type => MealType)
  type: MealType

  @Field(type => Date, { nullable: true })
  time?: Date

  @Field(type => [DishItemInput])
  @ArrayNotEmpty()
  items: DishItemInput[]
}

@ObjectType()
export class MealItem {
  @Field(type => ID)
  id: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  unitDescription?: string

  @Field({ nullable: true })
  subtitle?: string

  @Field(type => Image, { nullable: true })
  thumbnail?: Image

  unit?: string

  @Field({ nullable: true })
  amount?: number

  @Field({ nullable: true })
  seq?: number

  @Field({ nullable: true })
  totalTime?: number

  @Field(type => [Weight], { nullable: true })
  weights?: Weight[]

  @Field({ nullable: true })
  weightId?: string

  @Field(type => Nutrition, { nullable: true })
  nutrition?: Nutrition

  @Field()
  slug?: string

  // foodId?: string
  // recipeId?: Ref<Recipe>
}

@ObjectType()
export class UserMeal {
  @Field()
  name: string

  @Field()
  time: string

  @Field(type => Int)
  energyPercentageOfDay: number

  @Field(type => Int)
  availableTime: number

  @Field(type => Boolean)
  cook: boolean

  @Field(type => [MealItem])
  @prop()
  items: MealItem[]
}