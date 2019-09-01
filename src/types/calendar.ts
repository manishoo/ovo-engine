import { ObjectType, Field, InputType } from "type-graphql"
import { UserSchema } from "@Models/user.model"
import { Ref } from "typegoose"
import { User } from "@Types/user"
import { DishItemInput, DishItem } from "@Types/dish"
import { Pagination, MealType } from "@Types/common"
import { ArrayNotEmpty } from "class-validator"

@ObjectType()
export class CalendarMeal {

  @Field(type => MealType)
  type: MealType

  @Field({ nullable: true })
  time?: Date

  @Field(type => [DishItem])
  @ArrayNotEmpty()
  dish: DishItem[]

}

@InputType()
export class CalendarMealInput {

  @Field(type => MealType)
  type: MealType

  @Field(type => Date, { nullable: true })
  time?: Date

  @Field(type => [DishItemInput])
  @ArrayNotEmpty()
  dish: DishItemInput[]

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
