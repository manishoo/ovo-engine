/*
 * meal-plan.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Field, ObjectType} from 'type-graphql'
import {prop, Typegoose} from 'typegoose'
import {UserMeal} from '~/dao/types'
import mongoose from '~/dao/connections/mongoose'
import {WEEKDAYS} from '~/constants/enums'


@ObjectType()
export class Day {
	@Field()
	dayName: WEEKDAYS
	@Field(type => [UserMeal])
	meals: UserMeal[]
}

@ObjectType()
export class MealPlan {
	@Field()
	id: string
	@Field()
	name: string
	@Field(type => [Day])
	days: Day[]

	_id?: string
}


export class MealPlanSchema extends Typegoose implements MealPlan {
	id: string
	@prop({required: true})
	name: string
	@prop({required: true})
	days: Day[]

	_id?: string
}

export const MealPlanModel = new MealPlanSchema().getModelForClass(MealPlanSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'mealPlans',
		timestamps: true,
		emitIndexErrors: true,
		validateBeforeSave: true,
	}
})
