/*
 * meal-plan.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealPlanner from '@Services/meal-plan/utils/meal-planner'
import UserService from '@Services/user/user.service'
import { LANGUAGE_CODES } from '@Types/common'
import { MealPlan } from '@Types/meal-plan'
import { MealPlanModel } from '@Models/meal-plan.model'
import Errors from '@Utils/errors'
import { Service } from 'typedi'

@Service()
export default class MealPlanService {
	constructor(
		// service injection
		private readonly userService: UserService
	) {
		// noop
	}

	async create(data: MealPlan) {
		try {
			const newPlan = new MealPlanModel(data)
			return newPlan.save()
		} catch (e) {
			console.log(e)
			throw e
		}
	}

	async generateMealPlan(userId: string): Promise<MealPlan> {
		const user = await this.userService.findById(userId)
		if (!user.meals) throw new Errors.Validation('no meals')

		const plan = await MealPlanner.generateMealPlan(user.meals)
		user.mealPlans = user.mealPlans ? [...user.mealPlans, plan._id] : [plan._id]
		await this.userService.modify(userId, user)
		return plan
	}
}