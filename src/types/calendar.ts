/*
 * calendar.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { UserActivity } from '@Types/activity'
import { ObjectId, Ref } from '@Types/common'
import { MealItem, MealItemInput } from '@Types/meal'
import { User, UserMeal, UserMealInput } from '@Types/user'
import { ArrayNotEmpty } from 'class-validator'
import { Field, InputType, ObjectType } from 'type-graphql'


@ObjectType()
export class DayMeal {
  @Field()
  id: ObjectId

  @Field(type => UserMeal)
  userMeal: UserMeal

  @Field({ nullable: true })
  time?: Date

  @Field({
    nullable: true,
    description: 'if this DayMeal was associated with a Meal, this is its id',
  })
  mealId?: ObjectId

  @Field(type => [MealItem])
  @ArrayNotEmpty()
  items: MealItem[]

  @Field({ nullable: true })
  ate?: boolean
}

@InputType()
export class DayMealInput {
  @Field({ nullable: true })
  id?: ObjectId

  @Field(type => UserMealInput)
  userMeal: UserMealInput

  @Field({ nullable: true })
  time?: Date

  @Field(type => [MealItemInput], { nullable: true })
  items?: MealItemInput[]

  @Field({ nullable: true })
  ate?: boolean
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

@ObjectType({ simpleResolvers: true })
export class Day {
  _id?: ObjectId

  @Field()
  id?: ObjectId

  @Field(type => Date)
  date: Date

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [DayMeal])
  meals: DayMeal[]

  @Field(type => [UserActivity], { nullable: true })
  activities?: UserActivity[]

  @Field(type => BodyMeasurement)
  measurements?: BodyMeasurement
}

@InputType()
export class DayInput {
  @Field({ nullable: true })
  id?: ObjectId

  @Field(type => Date)
  date: Date

  @Field(type => [DayMealInput])
  meals: DayMealInput[]
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
