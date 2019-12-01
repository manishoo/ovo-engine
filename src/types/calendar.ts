/*
 * calendar.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { UserActivity } from '@Types/activity'
import { MealType, ObjectId, Pagination, Ref } from '@Types/common'
import { MealItem, MealItemInput } from '@Types/meal'
import { User, UserMeal } from '@Types/user'
import { ArrayNotEmpty } from 'class-validator'
import { Field, InputType, ObjectType } from 'type-graphql'


@ObjectType()
export class DayMeal {
  @Field()
  id: ObjectId

  @Field(type => UserMeal, { nullable: true })
  userMeal?: UserMeal

  @Field({ nullable: true })
  time?: Date

  @Field({ nullable: true })
  mealId?: ObjectId

  @Field(type => [MealItem])
  @ArrayNotEmpty()
  items: MealItem[]
}

@InputType()
export class DayMealInput {
  @Field(type => MealType)
  type: MealType

  @Field(type => Date)
  time: Date

  @Field(type => [MealItemInput])
  @ArrayNotEmpty()
  items: MealItemInput[]
}

@ObjectType()
export class BodyMeasurement {
  @Field(type => Date)
  time: Date

  @Field()
  weight: number
}

@InputType()
export class BodyMeasurementInput {
  @Field(type => Date)
  time: Date

  @Field()
  weight: number
}

@ObjectType()
export class Day {
  _id?: ObjectId
  @Field()
  id?: string

  @Field(type => Date)
  date: Date

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [DayMeal], { defaultValue: [] })
  meals: DayMeal[]

  @Field(type => [UserActivity], { nullable: true })
  activities?: UserActivity[]

  @Field()
  measurements?: BodyMeasurement

  @Field()
  totalBurnt?: number
}

@ObjectType()
export class CalendarResponse {
  @Field(type => [Day])
  calendar: Day[]

  @Field(type => Pagination)
  pagination: Pagination
}

@InputType()
export class LogActivityInput {
  @Field()
  activityName: string

  @Field()
  duration: number

  @Field()
  activityId: string

  @Field()
  burntCalories: number

  @Field(type => Date)
  time: Date
}
