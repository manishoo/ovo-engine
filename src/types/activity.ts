/*
 * activity.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectId, Ref, Translation, TranslationInput } from '@Types/common'
import { Field, InputType, ObjectType } from 'type-graphql'


@ObjectType()
export class Activity {
  _id?: ObjectId
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

@InputType()
export class ActivityInput {
  @Field(type => [TranslationInput])
  activityTypeName: TranslationInput[]

  @Field()
  met: number

  @Field({ nullable: true })
  icon?: string

  @Field()
  activityGroupId: ObjectId
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
  _id?: ObjectId
  @Field()
  id?: string

  @Field(type => [Translation])
  name: Translation[]

  @Field()
  slug: string
}
