/*
 * meal-plan.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Image, ObjectId, Ref, Translation, TranslationInput } from '@Types/common'
import { BasicUser } from '@Types/user'
import { GraphQLUpload } from 'apollo-server'
import { Field, InputType, ObjectType } from 'type-graphql'


@ObjectType()
export class Plan {
  readonly _id: ObjectId

  @Field()
  readonly id: ObjectId

  @Field(type => BasicUser)
  user: Ref<BasicUser>

  @Field(type => [Translation], { nullable: true })
  name?: Translation[]

  @Field(type => [Translation], { nullable: true })
  description?: Translation[]

  @Field(type => Image, { nullable: true })
  coverImage?: Image

  @Field(type => Image, { nullable: true })
  thumbnailImage?: Image
}

@InputType()
export class PlanInput {
  @Field(type => [TranslationInput], { nullable: true })
  name?: TranslationInput[]

  @Field(type => [TranslationInput], { nullable: true })
  description?: TranslationInput[]

  @Field(type => GraphQLUpload!, { nullable: true })
  coverImage?: any

  @Field(type => GraphQLUpload!, { nullable: true })
  thumbnailImage?: any
}

export enum DAY_PERIOD {
  breakfast = 'breakfast',
  launch = 'launch',
  dinner = 'dinner',
}
