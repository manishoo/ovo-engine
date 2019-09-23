import { ObjectType, Field } from "type-graphql"
import { Translation } from "@Types/common"
import { Ref } from 'typegoose'


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
  @Field(type => [Translation])
  activityTypeName: Translation[]

  @Field()
  met: number

  @Field(type => ActivityGroup)
  activityGroup: Ref<ActivityGroup>
}

@ObjectType()
export class ActivityGroup {
  @Field(type => [Translation])
  name: Translation[]
}