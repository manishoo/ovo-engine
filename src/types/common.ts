/*
 * common.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import mongoose from 'mongoose'
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'
import { prop } from 'typegoose'


export enum LanguageCode {
  en = 'en',
  fa = 'fa',
}

registerEnumType(LanguageCode, {
  name: 'LanguageCode',
  description: 'Language codes'
})

export enum Status {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
}

export enum OperatorRole {
  admin = 'ADMIN',
  operator = 'OPERATOR',
}

registerEnumType(OperatorRole, {
  name: 'OperatorRole',
  description: 'Operator roles'
})

export enum UserRole {
  user = 'USER',
  operator = 'OPERATOR',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User roles'
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

  // @Field(type => String, {nullable: true})
  authorId?: Ref<UserSchema>

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

  // @Field(type => String, {nullable: true})
  authorId?: Ref<UserSchema>

  @Field()
  url: string

  alt?: string
}

@ObjectType()
export class Pagination {
  @Field()
  page: number
  @Field()
  size: number
  @Field()
  totalPages: number
  @Field()
  hasNext: boolean

  @Field({ nullable: true })
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

  @Field(type => Int)
  totalTime: number
}

@InputType()
export class TimingInput {
  @Field(type => Int, { nullable: true })
  prepTime?: number

  @Field(type => Int, { nullable: true })
  cookTime?: number

  @Field(type => Int)
  totalTime: number
}

export enum UnitEnum {
  kg = 'kg',
  lb = 'lb',
  m = 'm',
  cm = 'cm',
}

registerEnumType(UnitEnum, {
  name: 'UnitEnum',
  description: 'Unit enum'
})

@ObjectType()
export class Unit {
  @Field()
  value: number

  @Field()
  unit: UnitEnum
}

@InputType()
export class UnitInput {
  @Field()
  value: number

  @Field(type => UnitEnum)
  unit: UnitEnum
}

export declare type Ref<T> = T | mongoose.Types.ObjectId;

export declare type UnitType<T> = { value: number, unit: T }
