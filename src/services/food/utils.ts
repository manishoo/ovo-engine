/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {MealUnit} from '~/dao/models/user.model'
import {UserMeal} from '~/dao/types'
import {MEAL_ITEM_TYPES} from '~/constants/enums'

export enum DAY_PERIOD {
	breakfast = 'breakfast',
	launch = 'launch',
	dinner = 'dinner',
}

export function recognizeDayPeriod(time: string): DAY_PERIOD {
	const splitTime = time.split(':')
	if (splitTime[0].length !== 2) throw Error('time format should be HH:mm')
	if (splitTime[1].length !== 2) throw Error('time format should be HH:mm')

	const baseDate = new Date()
	const mealDate = baseDate
	const noonDate = baseDate
	const afterNoonDate = baseDate
	const morningDate = baseDate
	const nightDate = baseDate

	morningDate.setHours(0)
	noonDate.setHours(12)
	afterNoonDate.setHours(18)
	nightDate.setHours(23)
	nightDate.setMinutes(59)

	mealDate.setHours(+splitTime[0])
	mealDate.setMinutes(+splitTime[1])

	if (mealDate >= morningDate && mealDate < noonDate) {
		// breakfast
		return DAY_PERIOD.breakfast
	} else if (mealDate >= noonDate && mealDate < afterNoonDate) {
		// launch
		return DAY_PERIOD.launch
	} else if (mealDate >= afterNoonDate && mealDate < nightDate) {
		// dinner
		return DAY_PERIOD.dinner
	} else {
		throw Error('time is not correct')
	}
}

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