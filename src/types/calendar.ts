import { ObjectType, Field, InputType } from "type-graphql"
import { UserSchema } from "@Models/user.model"
import { Ref } from "typegoose"
import { User } from "@Types/user"
import { DishSchema } from "@Models/dish.model"
import { Dish } from "./dish"
import { Pagination, MealType } from "@Types/common"

@ObjectType()
export class CalendarMeal {

  @Field(type => MealType)
  type: MealType

  @Field()
  time: Date

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

  @Field(type => Date)
  date: Date

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [CalendarMeal])
  meals: CalendarMeal[]
}

@ObjectType()
export class CalendarResponse {

  @Field(type => [Day])
  calendar: Day[]

  @Field(type => Pagination)
  pagination: Pagination
}
