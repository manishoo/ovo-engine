/*
 * meal-planner.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { createCucumber } from './create-cucumber'
import { UserMeal } from '@Types/eating'
import { Day, MealPlan, WEEKDAYS } from '@Types/meal-plan'
import { MealUnit } from '@Types/user'
import { Container } from 'typedi'
import MealPlanService from '../meal-plan.service'

export default class MealPlanner {
	static generateMealPlan(mealRoutine: MealUnit[]) {
		// TODO make sure time is always correct from the source
		// let week: { [k: string]: Day } = {}
		let days: Day[] = []
		for (let day in WEEKDAYS) {
			const meals: UserMeal[] = []
			// generate for a day 7 times
			mealRoutine.map((meal) => {
				return createCucumber(meals, meal)
				// TODO RE-UNCOMMENT
				// const period = recognizeDayPeriod(meal.time)
				//
				// switch (period) {
				// 	case DAY_PERIOD.breakfast:
				// 		return createCucumber(meals, meal)
				// 	case DAY_PERIOD.launch:
				// 		return createCucumber(meals, meal)
				// 	case DAY_PERIOD.dinner:
				// 		return createCucumber(meals, meal)
				// }
			})
			days.push({
				dayName: <WEEKDAYS>day,
				meals,
			})
		}

		const mealPlanService = Container.get(MealPlanService)

		return mealPlanService.create(<MealPlan>{
			name: 'default',
			days,
		})
	}
}
