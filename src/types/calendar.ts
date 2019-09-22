import { UserSchema } from '@Models/user.model'
import { MealType, Pagination } from '@Types/common'
import { MealItem, MealItemInput } from '@Types/meal'
import { User } from '@Types/user'
import { ArrayNotEmpty } from 'class-validator'
import mongoose from 'mongoose'
import { Field, InputType, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'


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
export class Day {
  _id?: mongoose.Schema.Types.ObjectId
  @Field()
  id?: string

  @Field(type => Date)
  date: Date

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [DayMeal])
  meals: DayMeal[]
}

@ObjectType()
export class CalendarResponse {
  @Field(type => [Day])
  calendar: Day[]

  @Field(type => Pagination)
  pagination: Pagination
}
