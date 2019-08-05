/*
 * food.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Image, Translation, LanguageCode, NameAndId, Pagination } from '@Types/common'
import { Content, CONTENT_TYPE } from '@Types/content'
import { Weight } from '@Types/weight'
import mongoose from 'mongoose'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose';
import { FoodClassSchema } from '@Models/food-class.model';


@ObjectType()
export class NutrientData {
	@Field()
	content: number
	@Field()
	unit: string
}


@ObjectType()
export class NutritionalData {
	@Field({ nullable: true })
	saturatedFat?: NutrientData
	@Field({ nullable: true })
	polyUnsaturatedFat?: NutrientData
	@Field({ nullable: true })
	monoUnsaturatedFat?: NutrientData
	@Field({ nullable: true })
	unsaturatedFat?: NutrientData
	@Field({ nullable: true })
	cholesterol?: NutrientData
	@Field({ nullable: true })
	sodium?: NutrientData
	@Field({ nullable: true })
	potassium?: NutrientData
	@Field({ nullable: true })
	totalFat?: NutrientData
	@Field({ nullable: true })
	totalCarbohydrates?: NutrientData
	@Field({ nullable: true })
	dietaryFiber?: NutrientData
	@Field({ nullable: true })
	sugars?: NutrientData
	@Field({ nullable: true })
	protein?: NutrientData
	@Field({ nullable: true })
	vitaminC?: NutrientData
	@Field({ nullable: true })
	vitaminA?: NutrientData
	@Field({ nullable: true })
	calcium?: NutrientData
	@Field({ nullable: true })
	iron?: NutrientData
	@Field({ nullable: true })
	calories?: NutrientData
	@Field({ nullable: true })
	caloriesFromFat?: NutrientData
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
	nutrients?: NutritionalData
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


@InputType()
export class FoodInput {
	@Field()
	name: string
	@Field({ nullable: true })
	description?: string
	@Field()
	lang: LanguageCode
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
	@Field(type => String)
	name: Translation[]
	origFoodId?: string
	origDb?: string
	foodClass: Ref<FoodClassSchema>
	contents: FoodContent[]
	@Field(type => [Weight])
	weights: Weight[]
}