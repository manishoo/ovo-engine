/*
 * food-class.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translation } from '@Types/common'
import { FoodGroup } from '@Types/food-group'
import * as mongoose from 'mongoose'
import { Field, ObjectType } from 'type-graphql'


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
	@Field(type => String)
	name: Translation[]
	@Field(type => String, {nullable: true})
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