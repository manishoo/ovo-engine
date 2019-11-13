/*
 * tag.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectId, Ref, Translation, TranslationInput } from '@Types/common'
import { User } from '@Types/user'
import { ArrayNotEmpty } from 'class-validator'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'


export enum TagType {
  cuisine = 'cuisine',
  meal = 'meal',
  diet = 'diet',
  recipe = 'recipe',
  ingredient = 'ingredient',
  occasion = 'occasion',
  imported = 'imported',
  other = 'other',
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
  _id?: ObjectId
  @Field({ nullable: true })
  slug?: string
  @Field(type => [Translation], { nullable: true })
  title?: Translation[]
  @Field(type => [Translation], { nullable: true })
  info?: Translation[]
  @Field(type => TagType)
  type: TagType
  @Field(type => String, { nullable: true })
  user?: Ref<User>

  createdAt?: Date
  updatedAt?: Date
}
