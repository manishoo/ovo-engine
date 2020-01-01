/*
 * weight.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectId, Translation, TranslationInput } from '@Types/common'
import { Field, InputType, ObjectType } from 'type-graphql'
import { prop } from 'typegoose'


@ObjectType()
export class Weight {
  @prop({ default: ObjectId })
  @Field(type => ObjectId)
  id: ObjectId
  @Field()
  amount: number
  @Field({ nullable: true })
  gramWeight?: number
  @Field()
  seq: number
  @Field(type => [Translation])
  name: Translation[]
}

@InputType()
export class WeightInput {
  @Field(type => ObjectId, { nullable: true })
  id?: ObjectId
  @Field()
  amount: number
  @Field()
  seq: number
  @Field({ nullable: true })
  unit?: string
  @Field()
  gramWeight: number
  @Field(type => [TranslationInput])
  name: TranslationInput[]
}
