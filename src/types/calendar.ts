import { UserSchema } from '@Models/user.model'
import { UserActivity } from '@Types/activity'
import { MealType, Pagination, Ref, WeightMeasurementUnit } from '@Types/common'
import { MealItem, MealItemInput } from '@Types/meal'
import { User } from '@Types/user'
import { ArrayNotEmpty } from 'class-validator'
import mongoose from 'mongoose'
import { Field, InputType, ObjectType } from 'type-graphql'


@ObjectType()
export class DayMeal {
  @Field(type => MealType)
  type: MealType

  @Field({ nullable: true })
  time?: Date

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
  @Field()
  weight: number

  @Field(type => WeightMeasurementUnit)
  weightUnit: WeightMeasurementUnit
}

@InputType()
export class BodyMeasurementInput {
  @Field(type => Date)
  time: Date

  @Field()
  weight: number

  @Field(type => WeightMeasurementUnit)
  weightUnit: WeightMeasurementUnit
}

@ObjectType()
export class Day {
  _id?: mongoose.Types.ObjectId
  @Field()
  id?: string

  @Field(type => Date)
  date: Date

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [DayMeal], { nullable: true })
  meals?: DayMeal[]

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
