/*
 * common.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import mongoose from 'mongoose'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { prop, Ref } from 'typegoose'


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

export enum Role {
  admin = 'ADMIN',
  operator = 'OPERATOR',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Operator roles'
})

export enum UserRole {
  user = 'USER',
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

export declare type Ref<T> = T | mongoose.Types.ObjectId;
