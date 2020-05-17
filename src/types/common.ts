/*
 * common.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from 'mongoose'
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'
import { prop } from 'typegoose'


export enum LanguageCode {
  en = 'en',
  fa = 'fa',
  ar = 'ar',
  fr = 'fr',
  it = 'it',
  es = 'es',
  de = 'de',
}

registerEnumType(LanguageCode, {
  name: 'LanguageCode',
  description: 'Language codes'
})

export enum Status {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
}

export enum Role {
  admin = 'ADMIN',
  operator = 'OPERATOR',
  user = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User Roles'
})

@ObjectType()
export class NameAndId {
  @Field()
  name: string
  @Field()
  id: string
}

@ObjectType()
export class Video {
  @Field({ nullable: true })
  width?: number

  @Field({ nullable: true })
  height?: number

  @Field({ nullable: true })
  sourceUrl?: string

  @Field({ nullable: true })
  source?: string

  @Field({ nullable: true })
  authorName?: string

  @Field()
  url: string
}

@ObjectType()
export class Image {
  @Field({ nullable: true })
  width?: number

  @Field({ nullable: true })
  height?: number

  @Field({ nullable: true })
  sourceUrl?: string

  @Field({ nullable: true })
  source?: string

  @Field({ nullable: true })
  authorName?: string

  @Field()
  url: string

  alt?: string
}

@ObjectType()
export class Pagination {
  @Field(type => Int)
  page: number
  @Field(type => Int)
  size: number
  @Field(type => Int)
  totalPages: number
  @Field()
  hasNext: boolean

  @Field(type => Int, { nullable: true })
  totalCount?: number
  @Field({ nullable: true })
  lastId?: string
}

@ObjectType()
export class Item {
  @Field()
  text: string
  @Field()
  value: string
}

export enum MealType {
  breakfast = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
  snack = 'snack',
}

registerEnumType(MealType, {
  name: 'MealType',
  description: 'Meal types'
})

@ObjectType()
export class Translation {
  @prop({ enum: LanguageCode, required: true })
  @Field(type => LanguageCode)
  locale: LanguageCode
  @prop({ required: true })
  @Field()
  text: string
  @Field({ nullable: true, defaultValue: true })
  @prop({ default: true })
  verified?: boolean
}

@InputType()
export class TranslationInput {
  @Field(type => LanguageCode)
  locale: LanguageCode
  @Field()
  text: string
  @Field({ nullable: true, defaultValue: true })
  verified?: boolean
}

@ObjectType()
export class Timing {
  @Field(type => Int, { nullable: true })
  prepTime?: number

  @Field(type => Int, { nullable: true })
  cookTime?: number

  @Field(type => Int, { nullable: true })
  totalTime?: number
}

@InputType()
export class TimingInput {
  @Field(type => Int, { nullable: true })
  prepTime?: number

  @Field(type => Int, { nullable: true })
  cookTime?: number

  @Field(type => Int, { nullable: true })
  totalTime?: number
}

export declare type Ref<T> = T | mongoose.Types.ObjectId

export class ObjectId extends mongoose.Types.ObjectId {
  constructor(key?: string | number) {
    super(key)
  }
}

@ObjectType()
export class CustomUnit {
  @Field(type => [Translation])
  name: Translation[]
  @Field({ nullable: true })
  gramWeight?: number
}

@InputType()
export class CustomUnitInput {
  @Field(type => [TranslationInput])
  name: TranslationInput[]
  @Field({ nullable: true })
  gramWeight?: number
}
