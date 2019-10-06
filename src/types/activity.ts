/*
 * activity.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectType, Field, InputType } from 'type-graphql'
import { Translation, TranslationInput, Ref } from "@Types/common"
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

@InputType()
export class ActivityInput {
  @Field(type => [TranslationInput])
  activityTypeName: TranslationInput[]

  @Field()
  met: number

  @Field({ nullable: true })
  icon?: string

  @Field()
  activityGroupId: mongoose.Types.ObjectId
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

  @Field()
  slug: string
}
