/*
 * food-group.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translation } from '@Types/common'
import mongoose from 'mongoose'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ParentFoodGroup {
	@Field()
	readonly id: string
	@Field(type => [Translation])
	name: Translation[]
	@Field(type => [FoodGroup])
	subGroups: FoodGroup[]
}

@ObjectType()
export class FoodGroup {
	readonly _id: mongoose.Schema.Types.ObjectId
	@Field()
	readonly id: string
	@Field(type => [Translation])
	name: Translation[]

	parentFoodGroup?: ParentFoodGroup | mongoose.Schema.Types.ObjectId
}