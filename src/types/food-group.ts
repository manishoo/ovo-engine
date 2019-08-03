/*
 * food-group.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { IntlString } from '@Types/common'
import * as mongoose from 'mongoose'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ParentFoodGroup {
	@Field()
	readonly id: number
	@Field(type => String)
	name: IntlString
}

@ObjectType()
export class FoodGroup {
	readonly _id: mongoose.Schema.Types.ObjectId
	@Field()
	readonly id: number
	@Field(type => String)
	name: IntlString
	@Field(type => ParentFoodGroup, { nullable: true })
	parentFoodGroup?: ParentFoodGroup | mongoose.Schema.Types.ObjectId
}