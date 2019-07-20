/*
 * meal-plan.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Day, MealPlan } from '@Types/meal-plan'
import { prop, Typegoose } from 'typegoose'


export class MealPlanSchema extends Typegoose implements MealPlan {
	id: string
	@prop({ required: true })
	name: string
	@prop({ required: true })
	days: Day[]
	_id?: string
}

export const MealPlanModel = new MealPlanSchema().getModelForClass(MealPlanSchema, {
	schemaOptions: {
		collection: 'mealPlans',
		timestamps: true,
		emitIndexErrors: true,
		validateBeforeSave: true,
	}
})
