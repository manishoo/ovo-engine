import { ObjectType, Field } from "type-graphql"
import { Translation } from "@Types/common"


@ObjectType()
export class UserActivity {
  @Field()
  duration: number

  @Field(type => [Translation])
  activityTypeName: Translation[]

  @Field()
  totalBurnt: number

  @Field()
  activityName: string

  @Field(type => Date)
  time: Date

  @Field({ nullable: true })
  icon?: string
}

@ObjectType()
export class Activity {
  @Field()
  activityTypeName: Translation[]

  @Field()
  burningRate: number

  @Field()
  met: number
}