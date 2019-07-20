/*
 * create-cucumber.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserMeal } from '@Types/eating'
import { MEAL_ITEM_TYPES } from '@Types/meals'
import { MealUnit } from '@Types/user'

export function createCucumber(meals: UserMeal[], meal: MealUnit) {
	return meals.push({
		name: meal.name,
		time: meal.time,
		energyPercentageOfDay: meal.energyPercentageOfDay,
		availableTime: meal.availableTime ? meal.availableTime : 0,
		cook: meal.cook ? meal.cook : false,
		items: [{
			type: MEAL_ITEM_TYPES.food,
			id: '57889125-8ff8-11e9-8939-0fa3a2f57647',
			amount: 1,
			// unit: 'doone',
			seq: 2,
		}, {
			type: MEAL_ITEM_TYPES.recipe,
			id: '5d0b92e7924c6f3055f6323a',
			// unit: 'serving',
			amount: 1,
			seq: 1,
		}]
	})
}
