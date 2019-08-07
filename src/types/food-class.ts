/*
 * food-class.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Field, ObjectType, InputType } from 'type-graphql'
import { Pagination, Translation, TranslationInput } from '@Types/common'

import { FoodGroup, FoodGroupInput } from '@Types/food-group'
import mongoose from 'mongoose'

export enum FOOD_CLASS_TYPES {
	type1 = 'Type 1',
	type2 = 'Type 2',
	unknown = 'Unknown',
}

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
	@Field()
	readonly id: string
	@Field(type => [TranslationInput])
	name: Translation[]
	@Field(type => [TranslationInput], { nullable: true })
	description?: Translation[]
	@Field()
	slug: string
	@Field(type => String)
	foodGroupId: string
	origId: number
	nameScientific?: string
	itisId?: string
	wikipediaId?: string
	foodType: FOOD_CLASS_TYPES
	category?: FOOD_CLASS_CATEGORY
	ncbiTaxonomyId?: number
	taxonomies: FoodClassTaxonomy[]
}

@ObjectType()
export class FoodClassListResponse {
	@Field(type => [FoodClass])
	foodClasses: FoodClass[]
	@Field(type => Pagination)
	pagination: Pagination
}