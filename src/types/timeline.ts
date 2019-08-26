import { ObjectType, Field, registerEnumType, InputType } from "type-graphql"
import { UserSchema } from "@Models/user.model"
import { Ref } from "typegoose"
import { User } from "@Types/user"
import { DishSchema } from "@Models/dish.model"
import { Dish } from "./dish"


export enum TimelineMealType {
  breakfast = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
  snack = 'snack',
}

registerEnumType(TimelineMealType, {
  name: 'TimelineMealType',
  description: 'Timeline meal types'
})

@ObjectType()
export class TimelineMeal {

  @Field(type => TimelineMealType)
  type: TimelineMealType

  @Field()
  time: Date

  @Field(type => Dish)
  dish: Ref<DishSchema>
}

@InputType()
export class TimelineMealInput {

  @Field(type => TimelineMealType)
  type: TimelineMealType

  @Field(type => Date)
  time: Date

  @Field(type => String)
  dish: Ref<DishSchema>
}

@ObjectType()
export class TimeLine {

  @Field(type => Date)
  date: Date

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [TimelineMeal])
  meals: TimelineMeal[]
}

