/*
 * eating.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Image } from '@Types/common'
import { NutritionalData } from '@Types/food'
import { MEAL_ITEM_TYPES } from '@Types/meals'
import { Weight } from '@Types/weight'
import { Field, ID, Int, ObjectType } from 'type-graphql'
import { prop } from 'typegoose'

@ObjectType()
export class MealItem {
	@Field(type => ID)
	id: string

	@Field()
	type: MEAL_ITEM_TYPES

	@Field({ nullable: true })
	title?: string

	@Field({ nullable: true })
	unitDescription?: string

	@Field({ nullable: true })
	subtitle?: string

	@Field(type => Image, { nullable: true })
	thumbnail?: Image

	unit?: string

	@Field({ nullable: true })
	amount?: number

	@Field({ nullable: true })
	seq?: number

	@Field({ nullable: true })
	totalTime?: number

	@Field(type => [Weight], { nullable: true })
	weights?: Weight[]

	@Field({ nullable: true })
	weightId?: string

	@Field(type => NutritionalData, { nullable: true })
	nutritionalData?: NutritionalData

	@Field()
	slug?: string

	// foodId?: string
	// recipeId?: Ref<Recipe>
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