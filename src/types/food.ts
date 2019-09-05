/*
 * food.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassSchema } from '@Models/food-class.model'
import { Image, LanguageCode, NameAndId, Pagination, Translation, TranslationInput } from '@Types/common'
import { Content, CONTENT_TYPE } from '@Types/content'
import { Weight, WeightInput } from '@Types/weight'
import { GraphQLUpload } from 'apollo-server'
import mongoose from 'mongoose'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'


@ObjectType()
export class NutrientUnit {
  @Field({ nullable: true })
  id?: string
  @Field()
  amount: number
  @Field()
  unit: string
}

@InputType()
export class NutrientUnitInput {
  @Field({ nullable: true })
  id?: string
  @Field()
  amount: number
  @Field()
  unit: string
}

@ObjectType()
export class Nutrition {
  [k: string]: NutrientUnit | undefined

  @Field({ nullable: true })
  saturatedFat?: NutrientUnit
  @Field({ nullable: true })
  alaFattyAcid?: NutrientUnit
  @Field({ nullable: true })
  alanine?: NutrientUnit
  @Field({ nullable: true })
  alcohol?: NutrientUnit
  @Field({ nullable: true })
  alphaCarotene?: NutrientUnit
  @Field({ nullable: true })
  arginine?: NutrientUnit
  @Field({ nullable: true })
  asparticAcid?: NutrientUnit
  @Field({ nullable: true })
  betaCarotene?: NutrientUnit
  @Field({ nullable: true })
  betaine?: NutrientUnit
  @Field({ nullable: true })
  caffeine?: NutrientUnit
  @Field({ nullable: true })
  calcium?: NutrientUnit
  @Field({ nullable: true })
  calories?: NutrientUnit
  @Field({ nullable: true })
  carbs?: NutrientUnit
  @Field({ nullable: true })
  cholesterol?: NutrientUnit
  @Field({ nullable: true })
  choline?: NutrientUnit
  @Field({ nullable: true })
  copper?: NutrientUnit
  @Field({ nullable: true })
  cystine?: NutrientUnit
  @Field({ nullable: true })
  dhaFattyAcid?: NutrientUnit
  @Field({ nullable: true })
  dpaFattyAcid?: NutrientUnit
  @Field({ nullable: true })
  epaFattyAcid?: NutrientUnit
  @Field({ nullable: true })
  fats?: NutrientUnit
  @Field({ nullable: true })
  fiber?: NutrientUnit
  @Field({ nullable: true })
  fluoride?: NutrientUnit
  @Field({ nullable: true })
  folate?: NutrientUnit
  @Field({ nullable: true })
  fructose?: NutrientUnit
  @Field({ nullable: true })
  galactose?: NutrientUnit
  @Field({ nullable: true })
  glucose?: NutrientUnit
  @Field({ nullable: true })
  glutamicAcid?: NutrientUnit
  @Field({ nullable: true })
  glycine?: NutrientUnit
  @Field({ nullable: true })
  histidine?: NutrientUnit
  @Field({ nullable: true })
  hydroxyproline?: NutrientUnit
  @Field({ nullable: true })
  iron?: NutrientUnit
  @Field({ nullable: true })
  isoleucine?: NutrientUnit
  @Field({ nullable: true })
  lactose?: NutrientUnit
  @Field({ nullable: true })
  leucine?: NutrientUnit
  @Field({ nullable: true })
  lycopene?: NutrientUnit
  @Field({ nullable: true })
  lysine?: NutrientUnit
  @Field({ nullable: true })
  magnesium?: NutrientUnit
  @Field({ nullable: true })
  maltose?: NutrientUnit
  @Field({ nullable: true })
  manganese?: NutrientUnit
  @Field({ nullable: true })
  methionine?: NutrientUnit
  @Field({ nullable: true })
  monounsaturatedFats?: NutrientUnit
  @Field({ nullable: true })
  niacin?: NutrientUnit
  @Field({ nullable: true })
  pantothenicAcid?: NutrientUnit
  @Field({ nullable: true })
  phenylalanine?: NutrientUnit
  @Field({ nullable: true })
  phosphorus?: NutrientUnit
  @Field({ nullable: true })
  polyunsaturatedFats?: NutrientUnit
  @Field({ nullable: true })
  potassium?: NutrientUnit
  @Field({ nullable: true })
  proline?: NutrientUnit
  @Field({ nullable: true })
  proteins?: NutrientUnit
  @Field({ nullable: true })
  retinol?: NutrientUnit
  @Field({ nullable: true })
  riboflavin?: NutrientUnit
  @Field({ nullable: true })
  saturatedFats?: NutrientUnit
  @Field({ nullable: true })
  selenium?: NutrientUnit
  @Field({ nullable: true })
  serine?: NutrientUnit
  @Field({ nullable: true })
  sodium?: NutrientUnit
  @Field({ nullable: true })
  starch?: NutrientUnit
  @Field({ nullable: true })
  sucrose?: NutrientUnit
  @Field({ nullable: true })
  sugar?: NutrientUnit
  @Field({ nullable: true })
  theobromine?: NutrientUnit
  @Field({ nullable: true })
  thiamine?: NutrientUnit
  @Field({ nullable: true })
  threonine?: NutrientUnit
  @Field({ nullable: true })
  totalOmega3?: NutrientUnit
  @Field({ nullable: true })
  totalOmega6?: NutrientUnit
  @Field({ nullable: true })
  transFats?: NutrientUnit
  @Field({ nullable: true })
  tryptophan?: NutrientUnit
  @Field({ nullable: true })
  tyrosine?: NutrientUnit
  @Field({ nullable: true })
  valine?: NutrientUnit
  @Field({ nullable: true })
  vitA?: NutrientUnit
  @Field({ nullable: true })
  vitAIU?: NutrientUnit
  @Field({ nullable: true })
  vitB12?: NutrientUnit
  @Field({ nullable: true })
  vitB6?: NutrientUnit
  @Field({ nullable: true })
  vitC?: NutrientUnit
  @Field({ nullable: true })
  vitD?: NutrientUnit
  @Field({ nullable: true })
  vitD2?: NutrientUnit
  @Field({ nullable: true })
  vitD3?: NutrientUnit
  @Field({ nullable: true })
  vitDUI?: NutrientUnit
  @Field({ nullable: true })
  vitE?: NutrientUnit
  @Field({ nullable: true })
  vitK?: NutrientUnit
  @Field({ nullable: true })
  water?: NutrientUnit
  @Field({ nullable: true })
  zinc?: NutrientUnit
}

@InputType()
export class NutritionInput {
  [k: string]: NutrientUnit | undefined

  @Field({ nullable: true })
  saturatedFat?: NutrientUnitInput
  @Field({ nullable: true })
  alaFattyAcid?: NutrientUnitInput
  @Field({ nullable: true })
  alanine?: NutrientUnitInput
  @Field({ nullable: true })
  alcohol?: NutrientUnitInput
  @Field({ nullable: true })
  alphaCarotene?: NutrientUnitInput
  @Field({ nullable: true })
  arginine?: NutrientUnitInput
  @Field({ nullable: true })
  asparticAcid?: NutrientUnitInput
  @Field({ nullable: true })
  betaCarotene?: NutrientUnitInput
  @Field({ nullable: true })
  betaine?: NutrientUnitInput
  @Field({ nullable: true })
  caffeine?: NutrientUnitInput
  @Field({ nullable: true })
  calcium?: NutrientUnitInput
  @Field({ nullable: true })
  calories?: NutrientUnitInput
  @Field({ nullable: true })
  carbs?: NutrientUnitInput
  @Field({ nullable: true })
  cholesterol?: NutrientUnitInput
  @Field({ nullable: true })
  choline?: NutrientUnitInput
  @Field({ nullable: true })
  copper?: NutrientUnitInput
  @Field({ nullable: true })
  cystine?: NutrientUnitInput
  @Field({ nullable: true })
  dhaFattyAcid?: NutrientUnitInput
  @Field({ nullable: true })
  dpaFattyAcid?: NutrientUnitInput
  @Field({ nullable: true })
  epaFattyAcid?: NutrientUnitInput
  @Field({ nullable: true })
  fats?: NutrientUnitInput
  @Field({ nullable: true })
  fiber?: NutrientUnitInput
  @Field({ nullable: true })
  fluoride?: NutrientUnitInput
  @Field({ nullable: true })
  folate?: NutrientUnitInput
  @Field({ nullable: true })
  fructose?: NutrientUnitInput
  @Field({ nullable: true })
  galactose?: NutrientUnitInput
  @Field({ nullable: true })
  glucose?: NutrientUnitInput
  @Field({ nullable: true })
  glutamicAcid?: NutrientUnitInput
  @Field({ nullable: true })
  glycine?: NutrientUnitInput
  @Field({ nullable: true })
  histidine?: NutrientUnitInput
  @Field({ nullable: true })
  hydroxyproline?: NutrientUnitInput
  @Field({ nullable: true })
  iron?: NutrientUnitInput
  @Field({ nullable: true })
  isoleucine?: NutrientUnitInput
  @Field({ nullable: true })
  lactose?: NutrientUnitInput
  @Field({ nullable: true })
  leucine?: NutrientUnitInput
  @Field({ nullable: true })
  lycopene?: NutrientUnitInput
  @Field({ nullable: true })
  lysine?: NutrientUnitInput
  @Field({ nullable: true })
  magnesium?: NutrientUnitInput
  @Field({ nullable: true })
  maltose?: NutrientUnitInput
  @Field({ nullable: true })
  manganese?: NutrientUnitInput
  @Field({ nullable: true })
  methionine?: NutrientUnitInput
  @Field({ nullable: true })
  monounsaturatedFats?: NutrientUnitInput
  @Field({ nullable: true })
  niacin?: NutrientUnitInput
  @Field({ nullable: true })
  pantothenicAcid?: NutrientUnitInput
  @Field({ nullable: true })
  phenylalanine?: NutrientUnitInput
  @Field({ nullable: true })
  phosphorus?: NutrientUnitInput
  @Field({ nullable: true })
  polyunsaturatedFats?: NutrientUnitInput
  @Field({ nullable: true })
  potassium?: NutrientUnitInput
  @Field({ nullable: true })
  proline?: NutrientUnitInput
  @Field({ nullable: true })
  proteins?: NutrientUnitInput
  @Field({ nullable: true })
  retinol?: NutrientUnitInput
  @Field({ nullable: true })
  riboflavin?: NutrientUnitInput
  @Field({ nullable: true })
  saturatedFats?: NutrientUnitInput
  @Field({ nullable: true })
  selenium?: NutrientUnitInput
  @Field({ nullable: true })
  serine?: NutrientUnitInput
  @Field({ nullable: true })
  sodium?: NutrientUnitInput
  @Field({ nullable: true })
  starch?: NutrientUnitInput
  @Field({ nullable: true })
  sucrose?: NutrientUnitInput
  @Field({ nullable: true })
  sugar?: NutrientUnitInput
  @Field({ nullable: true })
  theobromine?: NutrientUnitInput
  @Field({ nullable: true })
  thiamine?: NutrientUnitInput
  @Field({ nullable: true })
  threonine?: NutrientUnitInput
  @Field({ nullable: true })
  totalOmega3?: NutrientUnitInput
  @Field({ nullable: true })
  totalOmega6?: NutrientUnitInput
  @Field({ nullable: true })
  transFats?: NutrientUnitInput
  @Field({ nullable: true })
  tryptophan?: NutrientUnitInput
  @Field({ nullable: true })
  tyrosine?: NutrientUnitInput
  @Field({ nullable: true })
  valine?: NutrientUnitInput
  @Field({ nullable: true })
  vitA?: NutrientUnitInput
  @Field({ nullable: true })
  vitAIU?: NutrientUnitInput
  @Field({ nullable: true })
  vitB12?: NutrientUnitInput
  @Field({ nullable: true })
  vitB6?: NutrientUnitInput
  @Field({ nullable: true })
  vitC?: NutrientUnitInput
  @Field({ nullable: true })
  vitD?: NutrientUnitInput
  @Field({ nullable: true })
  vitD2?: NutrientUnitInput
  @Field({ nullable: true })
  vitD3?: NutrientUnitInput
  @Field({ nullable: true })
  vitDUI?: NutrientUnitInput
  @Field({ nullable: true })
  vitE?: NutrientUnitInput
  @Field({ nullable: true })
  vitK?: NutrientUnitInput
  @Field({ nullable: true })
  water?: NutrientUnitInput
  @Field({ nullable: true })
  zinc?: NutrientUnitInput
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
  @Field(type => Nutrition)
  nutrition: Nutrition
  @Field(type => Image)
  imageUrl?: Image
  @Field(type => Image)
  thumbnailUrl?: Image
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
  @Field(type => GraphQLUpload, { nullable: true })
  imageUrl?: any
  @Field(type => GraphQLUpload, { nullable: true })
  thumbnailUrl?: any
}

@ArgsType()
export class FoodListArgs {
  @Field({ nullable: true, defaultValue: 1 })
  page: number
  @Field({ nullable: true, defaultValue: 10 })
  size: number
  @Field({ nullable: true })
  foodClassId: string
  @Field({ nullable: true })
  nameSearchQuery: string
}
