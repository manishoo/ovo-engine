/*
 * types.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Field, ID, InputType, Int, ObjectType} from 'type-graphql'
import {Operator} from '~/dao/models/operator.model'
import {LANGUAGE_CODES, MEAL_ITEM_TYPES} from '~/constants/enums'
import {prop, Ref} from 'typegoose'
import {UserSchema} from '~/dao/models/user.model'
import {Meal} from '~/dao/models/meal.model'


@ObjectType()
export class NutrientData {
	@Field()
	content: number
	@Field()
	unit: string
}


@ObjectType()
export class NutritionalData {
	@Field({nullable: true})
	saturatedFat?: NutrientData
	@Field({nullable: true})
	polyUnsaturatedFat?: NutrientData
	@Field({nullable: true})
	monoUnsaturatedFat?: NutrientData
	@Field({nullable: true})
	unsaturatedFat?: NutrientData
	@Field({nullable: true})
	cholesterol?: NutrientData
	@Field({nullable: true})
	sodium?: NutrientData
	@Field({nullable: true})
	potassium?: NutrientData
	@Field({nullable: true})
	totalFat?: NutrientData
	@Field({nullable: true})
	totalCarbohydrates?: NutrientData
	@Field({nullable: true})
	dietaryFiber?: NutrientData
	@Field({nullable: true})
	sugars?: NutrientData
	@Field({nullable: true})
	protein?: NutrientData
	@Field({nullable: true})
	vitaminC?: NutrientData
	@Field({nullable: true})
	vitaminA?: NutrientData
	@Field({nullable: true})
	calcium?: NutrientData
	@Field({nullable: true})
	iron?: NutrientData
	@Field({nullable: true})
	calories?: NutrientData
	@Field({nullable: true})
	caloriesFromFat?: NutrientData
}

@ObjectType()
export class WeightTranslationO {
	@Field(type => String)
	lang: LANGUAGE_CODES
	@Field()
	description: string
}

@ObjectType()
export class Weight {
	@Field()
	id: string
	@Field()
	amount: number
	@Field()
	gramWeight: number
	@Field()
	seq: number
	@Field({nullable: true})
	description?: string
	@Field({nullable: true})
	unit?: string
	@Field(type => [WeightTranslationO], {nullable: true})
	translations?: WeightTranslationO[]
}

@ObjectType()
export class FoodVariety {
	@Field(type => ID)
	id?: string
	@Field()
	name: string
	@Field({nullable: true})
	description?: string
	@Field({nullable: true})
	nutrients?: NutritionalData
	@Field(type => [Weight], {nullable: true})
	weights?: Weight[]
	@Field()
	lang?: LANGUAGE_CODES
}

@ObjectType()
export class NameAndId {
	@Field()
	name: string
	@Field()
	id: string
}


@InputType()
export class WeightTranslationI {
	@Field(type => String)
	lang: LANGUAGE_CODES
	@Field()
	description: string
}


@InputType()
export class WeightInput {
	@Field({nullable: true})
	id?: string
	@Field()
	amount: number
	@Field(type => [WeightTranslationI])
	translations: WeightTranslationI[]
	@Field()
	seq: number
	@Field({nullable: true})
	unit?: string
	@Field()
	gramWeight: number
}

@ObjectType()
export class Video {
	@Field({nullable: true})
	width?: number

	@Field({nullable: true})
	height?: number

	@Field({nullable: true})
	sourceUrl?: string

	@Field({nullable: true})
	source?: string

	@Field({nullable: true})
	authorName?: string

	// @Field(type => String, {nullable: true})
	authorId?: Ref<UserSchema>

	@Field()
	url: string
}

@ObjectType()
export class Image {
	@Field({nullable: true})
	width?: number

	@Field({nullable: true})
	height?: number

	@Field({nullable: true})
	sourceUrl?: string

	@Field({nullable: true})
	source?: string

	@Field({nullable: true})
	authorName?: string

	// @Field(type => String, {nullable: true})
	authorId?: Ref<UserSchema>

	@Field()
	url: string
}

@ObjectType()
export class PersistedPassword {
	@Field()
	salt: string

	@Field()
	hash: string

	@Field(type => Int)
	iterations: number
}


@ObjectType()
export class MealItem {
	@Field(type => ID)
	id: string

	@Field()
	type: MEAL_ITEM_TYPES

	@Field({nullable: true})
	title?: string

	@Field({nullable: true})
	unitDescription?: string

	@Field({nullable: true})
	subtitle?: string

	@Field(type => Image, {nullable: true})
	thumbnail?: Image

	unit?: string

	@Field({nullable: true})
	amount?: number

	@Field({nullable: true})
	seq?: number

	@Field({nullable: true})
	totalTime?: number

	@Field(type => [Weight], {nullable: true})
	weights?: Weight[]

	@Field({nullable: true})
	weightId?: string

	@Field(type => NutritionalData, {nullable: true})
	nutritionalData?: NutritionalData

	@Field()
	slug?: string

	// foodId?: string
	// recipeId?: Ref<Recipe>
}

@ObjectType()
export class Nutrient {
	@Field()
	name: string
	@Field()
	amount: number
	@Field({nullable: true})
	tagname?: string
}

@ObjectType()
export class Food {
	@Field(type => ID)
	id: string
	@Field()
	name: string
	@Field({nullable: true})
	description?: string
	@Field(type => [NameAndId], {nullable: true})
	foodGroup?: NameAndId[]
	@Field({nullable: true})
	image?: Image
	@Field({nullable: true})
	thumbnail?: Image
	@Field(type => NutritionalData)
	nutrients?: NutritionalData
	// @Field(type => [Nutrient])
	// nutrients?: Nutrient[]
	@Field(type => [Weight], {nullable: true})
	weights?: Weight[]
	// @Field(type => [FoodVariety])
	// varieties: FoodVariety[]
}


@InputType()
export class FoodInput {
	@Field()
	name: string
	@Field({nullable: true})
	description?: string
	@Field()
	lang: LANGUAGE_CODES
}

@ObjectType()
export class FoodTranslationO {
	@Field()
	id: string
	@Field({nullable: true})
	fullDescription?: string
	@Field(type => [NameAndId], {nullable: true})
	foodGroup?: NameAndId[]
	@Field({nullable: true})
	image?: Image
	@Field(type => [FoodVariety])
	translations: FoodVariety[]
	@Field()
	isVerified: boolean
	@Field(type => [Weight])
	weights: Weight[]
}

@ObjectType()
export class Pagination {
	@Field({nullable: true})
	page?: number
	@Field({nullable: true})
	size?: number
	@Field({nullable: true})
	totalCount?: number
	@Field({nullable: true})
	totalPages?: number
	@Field({nullable: true})
	hasNext?: boolean
	@Field({nullable: true})
	lastId?: string
}


@ObjectType()
export class FoodsListResponse {
	@Field(type => [Food])
	foods: Food[]
	@Field(type => Pagination)
	pagination: Pagination
}


@ObjectType()
export class MealsListResponse {
	@Field(type => [Meal])
	meals: Meal[]
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


@ObjectType()
export class AuthResponse {
	@Field(type => Operator)
	operator: Operator
	@Field()
	session: string
}

@ObjectType()
export class UserMeal {
	@Field()
	name: string

	@Field()
	time: string

	@Field(type => Int)
	energyPercentageOfDay: number

	@Field(type => Int)
	availableTime: number

	@Field(type => Boolean)
	cook: boolean

	@Field(type => [MealItem])
	@prop()
	items: MealItem[]
}


@ObjectType()
export class Event {
	@Field()
	id: string

	@Field()
	name: string

	@Field()
	datetime: string

	@Field()
	type: 'meal' | 'exercise'

	@Field(type => UserMeal, {nullable: true})
	@prop()
	meal?: UserMeal
}
