/*
 * meal-plan.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealPlan } from '@Types/meal-plan'
import { MealPlanModel } from '@Models/meal-plan.model'
import { Service } from 'typedi'

@Service()
export default class MealPlanService {
	async create(data: MealPlan) {
		try {
			const newPlan = new MealPlanModel(data)
			return newPlan.save()
		} catch (e) {
			console.log(e)
			throw e
		}
	}
}