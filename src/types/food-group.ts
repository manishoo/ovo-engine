/*
 * food-group.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translation } from '@Types/common'
import * as mongoose from 'mongoose'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ParentFoodGroup {
	@Field()
	readonly id: number
	@Field(type => String)
	name: Translation[]
}

@ObjectType()
export class FoodGroup {
	readonly _id: mongoose.Schema.Types.ObjectId
	@Field()
	readonly id: string
	@Field(type => String)
	name: Translation[]
	@Field(type => ParentFoodGroup, { nullable: true })
	parentFoodGroup?: ParentFoodGroup | mongoose.Schema.Types.ObjectId
}