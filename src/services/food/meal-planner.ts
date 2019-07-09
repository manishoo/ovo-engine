/*
 * meal-planner.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealPlanRepo from 'src/dao/repositories/meal-plan.repository'
import {WEEKDAYS} from 'src/constants/enums'
import {MealUnit} from 'src/dao/models/user.model'
import {createCucumber, DAY_PERIOD, recognizeDayPeriod} from 'src/services/food/utils'
import {Day, MealPlan} from 'src/dao/models/meal-plan.model'
import {UserMeal} from 'src/dao/types'

export default {
	generateMealPlan(mealRoutine: MealUnit[]) {
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

		return MealPlanRepo.create(<MealPlan>{
			name: 'default',
			days,
		})
	}
}