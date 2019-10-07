/*
 * food-class.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Image, ObjectId, Pagination, Translation, TranslationInput } from '@Types/common'

import { FoodGroup } from '@Types/food-group'
import { GraphQLUpload } from 'apollo-server'
import { Max, Min } from 'class-validator'
import { ArgsType, Field, InputType, ObjectType, registerEnumType } from 'type-graphql'


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
  readonly _id: ObjectId
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
  image?: Image
  @Field(type => Image, { nullable: true })
  thumbnail?: Image
  @Field(type => String, { nullable: true })
  defaultFood?: ObjectId

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
  @Field(type => String, { nullable: true })
  defaultFood?: string

  @Field(type => GraphQLUpload, { nullable: true })
  image?: any
  @Field(type => GraphQLUpload, { nullable: true })
  thumbnail?: any
}

@ObjectType()
export class FoodClassListResponse {
  @Field(type => [FoodClass])
  foodClasses: FoodClass[]
  @Field(type => Pagination)
  pagination: Pagination
}

@ArgsType()
export class ListFoodClassesArgs {
  @Field({ defaultValue: 1 })
  @Min(1)
  page: number

  @Field({ defaultValue: 10 })
  @Min(1)
  @Max(30)
  size: number

  @Field({ nullable: true })
  foodGroupId?: string

  @Field({ nullable: true })
  nameSearchQuery?: string

  @Field({ nullable: true })
  verified?: boolean
}
