import { ObjectType, Field, registerEnumType, InputType } from "type-graphql"
import { UserSchema } from "@Models/user.model"
import { Ref } from "typegoose"
import { User } from "@Types/user"
import { DishSchema } from "@Models/dish.model"
import { Dish } from "./dish"
import { Pagination } from "./common";


export enum MealType {
  breakfast = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
  snack = 'snack',
}

registerEnumType(MealType, {
  name: 'MealType',
  description: 'alendar meal types'
})

@ObjectType()
export class CalendarMeal {

  @Field(type => MealType)
  type: MealType

  @Field()
  time: string

  @Field(type => Dish)
  dish: Ref<DishSchema>
}

@InputType()
export class CalendarMealInput {

  @Field(type => MealType)
  type: MealType

  @Field(type => Date)
  time: Date

  @Field(type => String)
  dish: Ref<DishSchema>
}

@ObjectType()
export class Day {

  @Field(type => String)
  date: string

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [CalendarMeal])
  meals: CalendarMeal[]
}

@ObjectType()
export class CalendarResponse {

  @Field(type => [Day])
  Calendar: Day[]

  @Field(type => Pagination)
  pagination: Pagination
}