/*
 * food-class.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Image, Pagination, Translation, TranslationInput } from '@Types/common'

import { FoodGroup } from '@Types/food-group'
import { GraphQLUpload } from 'apollo-server'
import mongoose from 'mongoose'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'


export enum FOOD_CLASS_TYPES {
  type1 = 'Type 1',
  type2 = 'Type 2',
  unknown = 'Unknown',
}

registerEnumType(FOOD_CLASS_TYPES, {
  name: 'FOOD_CLASS_TYPES',
  description: 'Food Types'
})

export enum FOOD_CLASS_CATEGORY {
  specific = 'specific',
  generic = 'generic',
}

export class FoodClassTaxonomy {
  ncbiTaxonomyId?: number
  classificationName?: string
  classificationOrder?: number
}

@ObjectType()
export class FoodClass {
  readonly _id: mongoose.Schema.Types.ObjectId
  @Field()
  readonly id: string
  @Field(type => [Translation])
  name: Translation[]
  @Field(type => [Translation], { nullable: true })
  description?: Translation[]
  @Field()
  slug: string
  @Field(type => FoodGroup)
  foodGroup: FoodGroup
  @Field(type => Image, { nullable: true })
  imageUrl?: Image
  @Field(type => Image, { nullable: true })
  thumbnailUrl?: Image
  @Field(type => String, { nullable: true })
  defaultFood?: mongoose.Types.ObjectId

  origId: number
  nameScientific?: string
  itisId?: string
  wikipediaId?: string
  foodType: FOOD_CLASS_TYPES
  category?: FOOD_CLASS_CATEGORY
  ncbiTaxonomyId?: number
  taxonomies: FoodClassTaxonomy[]
}

@InputType()
export class FoodClassInput {
  @Field(type => [TranslationInput])
  name: Translation[]
  @Field(type => [TranslationInput], { nullable: true })
  description?: Translation[]
  @Field()
  slug: string
  @Field(type => String)
  foodGroupId: string
  @Field(type => FOOD_CLASS_TYPES)
  foodType: FOOD_CLASS_TYPES

  @Field(type => GraphQLUpload, { nullable: true })
  imageUrl?: any
  @Field(type => GraphQLUpload, { nullable: true })
  thumbnailUrl?: any
}

@ObjectType()
export class FoodClassListResponse {
  @Field(type => [FoodClass])
  foodClasses: FoodClass[]
  @Field(type => Pagination)
  pagination: Pagination
}
