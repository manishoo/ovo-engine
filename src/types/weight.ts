/*
 * weight.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translation, TranslationInput } from '@Types/common'
import mongoose from 'mongoose'
import { Field, InputType, ObjectType } from 'type-graphql'
import { prop } from 'typegoose'


@ObjectType()
export class Weight {
  @prop({ default: mongoose.Types.ObjectId })
  @Field(type => String)
  id?: string | mongoose.Types.ObjectId
  @Field()
  amount: number
  @Field()
  gramWeight: number
  @Field()
  seq: number
  @Field(type => [Translation])
  name: Translation[]
}

@InputType()
export class WeightInput {
  @Field(type => String, { nullable: true })
  id?: string
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
