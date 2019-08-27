/*
 * food.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassSchema } from '@Models/food-class.model'
import { Image, LanguageCode, NameAndId, Pagination, Translation, TranslationInput } from '@Types/common'
import { Content, CONTENT_TYPE } from '@Types/content'
import { Weight, WeightInput } from '@Types/weight'
import mongoose from 'mongoose'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'


@ObjectType()
export class NutrientUnit {
  @Field()
  content: number
  @Field()
  unit: string
}

@InputType()
export class NutrientUnitInput {
  @Field()
  content: number
  @Field()
  unit: string
}

@ObjectType()
export class Nutrition {
  @Field({ nullable: true })
  saturatedFat?: NutrientUnit
  @Field({ nullable: true })
  polyUnsaturatedFat?: NutrientUnit
  @Field({ nullable: true })
  monoUnsaturatedFat?: NutrientUnit
  @Field({ nullable: true })
  unsaturatedFat?: NutrientUnit
  @Field({ nullable: true })
  cholesterol?: NutrientUnit
  @Field({ nullable: true })
  sodium?: NutrientUnit
  @Field({ nullable: true })
  potassium?: NutrientUnit
  @Field({ nullable: true })
  totalFat?: NutrientUnit
  @Field({ nullable: true })
  totalCarbohydrates?: NutrientUnit
  @Field({ nullable: true })
  dietaryFiber?: NutrientUnit
  @Field({ nullable: true })
  sugars?: NutrientUnit
  @Field({ nullable: true })
  protein?: NutrientUnit
  @Field({ nullable: true })
  vitaminC?: NutrientUnit
  @Field({ nullable: true })
  vitaminA?: NutrientUnit
  @Field({ nullable: true })
  calcium?: NutrientUnit
  @Field({ nullable: true })
  iron?: NutrientUnit
  @Field({ nullable: true })
  calories?: NutrientUnit
  @Field({ nullable: true })
  caloriesFromFat?: NutrientUnit
}

@InputType()
export class NutritionInput {
  @Field({ nullable: true })
  saturatedFat?: NutrientUnitInput
  @Field({ nullable: true })
  polyUnsaturatedFat?: NutrientUnitInput
  @Field({ nullable: true })
  monoUnsaturatedFat?: NutrientUnitInput
  @Field({ nullable: true })
  unsaturatedFat?: NutrientUnitInput
  @Field({ nullable: true })
  cholesterol?: NutrientUnitInput
  @Field({ nullable: true })
  sodium?: NutrientUnitInput
  @Field({ nullable: true })
  potassium?: NutrientUnitInput
  @Field({ nullable: true })
  totalFat?: NutrientUnitInput
  @Field({ nullable: true })
  totalCarbohydrates?: NutrientUnitInput
  @Field({ nullable: true })
  dietaryFiber?: NutrientUnitInput
  @Field({ nullable: true })
  sugars?: NutrientUnitInput
  @Field({ nullable: true })
  protein?: NutrientUnitInput
  @Field({ nullable: true })
  vitaminC?: NutrientUnitInput
  @Field({ nullable: true })
  vitaminA?: NutrientUnitInput
  @Field({ nullable: true })
  calcium?: NutrientUnitInput
  @Field({ nullable: true })
  iron?: NutrientUnitInput
  @Field({ nullable: true })
  calories?: NutrientUnitInput
  @Field({ nullable: true })
  caloriesFromFat?: NutrientUnitInput
}

@ObjectType()
export class FoodVariety {
  @Field(type => ID)
  id?: string
  @Field()
  name: string
  @Field({ nullable: true })
  description?: string
  @Field({ nullable: true })
  nutrients?: Nutrition
  @Field(type => [Weight], { nullable: true })
  weights?: Weight[]
  @Field()
  lang?: LanguageCode
}

@ObjectType()
export class Nutrient {
  @Field()
  name: string
  @Field()
  amount: number
  @Field({ nullable: true })
  tagname?: string
}

@ObjectType()
export class FoodTranslationO {
  @Field()
  id: string
  @Field({ nullable: true })
  fullDescription?: string
  @Field(type => [NameAndId], { nullable: true })
  foodGroup?: NameAndId[]
  @Field({ nullable: true })
  image?: Image
  @Field(type => [FoodVariety])
  translations: FoodVariety[]
  @Field()
  isVerified: boolean
  @Field(type => [Weight])
  weights: Weight[]
}

@ObjectType()
export class FoodsListResponse {
  @Field(type => [Food])
  foods: Food[]
  @Field(type => Pagination)
  pagination: Pagination
}

@ObjectType()
export class FoodsTranslationListResponse {
  @Field(type => [FoodTranslationO])
  foods: FoodTranslationO[]
  @Field(type => Pagination)
  pagination: Pagination
}

export interface FoodFind {
  query?: string,
  limit?: number,
  offset?: number,
  lang: LanguageCode,
  shouldIncludeNutrients?: boolean
}

export interface FoodTranslationList {
  limit?: number,
  offset?: number,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  query?: string,
  fgid?: string,
  isVerified?: boolean,
}

export interface FoodCreateInput {
  foodGroupId: string
  name: string
  description?: string
  imageUrl?: string
  nutrients: { id: string, value: number }[]
  proFactor?: number
  fatFactor?: number
  choFactor?: number
  nFactor?: number
  sci_name?: string
  refuse?: string
  survey?: string
  manufacturerName?: string
}

export class FoodContent {
  content: mongoose.Schema.Types.ObjectId | Content
  origContentName: string
  origContentType: CONTENT_TYPE
  amount: number
  unit: string
  citation: string
  citationType: string
  standardContent: number
}

@ObjectType()
export class Food {
  readonly _id: mongoose.Schema.Types.ObjectId
  @Field()
  readonly id: string
  @Field(type => [Translation])
  name: Translation[]
  @Field(type => [Translation], { nullable: true })
  description?: Translation[]
  @Field(type => [Weight])
  weights: Weight[]
  @Field({ nullable: true })
  origDb?: string
  origFoodId?: string
  foodClass: Ref<FoodClassSchema>
  contents: FoodContent[]
  Nutrition?: Nutrition
}

@InputType()
export class FoodInput {
  @Field(type => [TranslationInput])
  name: Translation[]
  @Field(type => [TranslationInput], { nullable: true })
  description?: TranslationInput[]
  @Field(type => [WeightInput])
  weights: WeightInput[]
  @Field(type => NutritionInput, { nullable: true })
  nutrition?: NutritionInput
}
