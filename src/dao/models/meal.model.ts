/*
 * meal.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Field, ObjectType} from 'type-graphql'
import {prop, Typegoose} from 'typegoose'
import {MealItem} from '~/dao/types'
import mongoose from '~/dao/connections/mongoose'

@ObjectType()
export class Meal extends Typegoose {
	constructor(obj?: any) {
		super()
		if (obj) {
			Object.assign(this, obj)
		}
	}

	// @Field()
	// name: string

	// @Field(type => Int)
	// timing: Timing
	//
	// @Field(type => Boolean)
	// cook: boolean

	@Field(type => [MealItem])
	@prop()
	items: MealItem[]
}

export const MealModel = new Meal().getModelForClass(Meal, {
	existingMongoose: mongoose,
})