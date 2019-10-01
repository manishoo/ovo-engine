import { ObjectType, Field } from 'type-graphql'
import { Ref, Translation } from '@Types/common'
import mongoose from 'mongoose'


@ObjectType()
export class Activity {
  _id?: mongoose.Types.ObjectId
  @Field()
  id?: string

  @Field(type => [Translation])
  activityTypeName: Translation[]

  @Field()
  met: number

  @Field({ nullable: true })
  icon?: string

  @Field(type => ActivityGroup)
  activityGroup: Ref<ActivityGroup>
}

@ObjectType()
export class UserActivity extends Activity {
  @Field()
  duration: number

  @Field()
  totalBurnt: number

  @Field()
  activityName: string

  @Field(type => Date)
  time: Date
}

@ObjectType()
export class ActivityGroup {
  _id?: mongoose.Types.ObjectId
  @Field()
  id?: string

  @Field(type => [Translation])
  name: Translation[]
}
