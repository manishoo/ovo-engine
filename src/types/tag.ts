/*
 * tag.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, TranslationInput, Translation } from '@Types/common'
import { Types } from 'mongoose'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { ArrayNotEmpty } from 'class-validator'


export enum TagType {
  cuisine = 'cuisine',
  meal = 'meal',
  diet = 'diet',
  recipe = 'recipe',
  ingredient = 'ingredient',
  occasion = 'occasion',
}

registerEnumType(TagType, {
  name: 'TagType',
  description: 'Tag types'
})

@InputType()
export class TagInput {
  @Field({ nullable: true })
  slug?: string
  @Field(type => [TranslationInput])
  @ArrayNotEmpty()
  title: TranslationInput[]
  @Field(type => [TranslationInput], { nullable: true })
  info?: TranslationInput[]
  @Field(type => TagType)
  type: TagType
}

@ObjectType()
export class Tag {
  _id?: Types.ObjectId
  @Field({ nullable: true })
  slug?: string
  @Field(type => [Translation], { nullable: true })
  title?: Translation[]
  @Field(type => [Translation], { nullable: true })
  info?: Translation[]
  @Field()
  type: TagType
  createdAt?: Date
  updatedAt?: Date
}
