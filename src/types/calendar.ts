import { ObjectType, Field } from "type-graphql"
import { UserSchema } from "@Models/user.model"
import { Ref } from "typegoose"
import { User } from "@Types/user"
import { Pagination } from "@Types/common"
import { Meal } from "@Types/eating"
import mongoose from 'mongoose'


@ObjectType()
export class Day {
  _id?: mongoose.Schema.Types.ObjectId
  @Field()
  id?: string

  @Field(type => Date)
  date: Date

  @Field(type => User)
  user: Ref<UserSchema>

  @Field(type => [Meal])
  meals: Meal[]
}

@ObjectType()
export class CalendarResponse {
  @Field(type => [Day])
  calendar: Day[]

  @Field(type => Pagination)
  pagination: Pagination
}
