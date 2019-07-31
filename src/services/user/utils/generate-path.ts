/*
 * generate-path.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserMeal } from '@Types/eating'
import { Event } from '@Types/event'
import { MealPlan, WEEKDAYS } from '@Types/meal-plan'
import Errors from '@Utils/errors'
import moment from 'moment'
import uuid from 'uuid/v1'

export function generatePath(mealPlan: MealPlan, timeZone: string): Event[] {
	const events: Event[] = []
	let currentDay: string = ''
	const localizedDate = moment().tz(timeZone)
	const daysArray: string[] = []
	Object.keys(WEEKDAYS)
		.map(k => daysArray.push(k))
	Object.keys(WEEKDAYS)
		.map(k => daysArray.push(k))

	mealPlan.days.map(day => {
		const nowLocalized = moment().tz(timeZone)
		const isoWeekDayNum = nowLocalized.isoWeekday()
		if (day.dayName === String(moment.weekdays()[isoWeekDayNum]).toLowerCase()) {
			currentDay = day.dayName
		}
	})

	let numberOfDaysAdded = 0
	let dayIndex = daysArray.findIndex(p => p == currentDay)

	while (numberOfDaysAdded <= 7) {
		const day = mealPlan.days.find(p => p.dayName === daysArray[dayIndex])
		if (!day) throw new Errors.Validation('no Day found')

		const futureMeals: { diff: number, meal: UserMeal, datetime: any }[] = []

		day.meals.map(meal => {
			const h = Number(meal.time.split(':')[0])
			const m = Number(meal.time.split(':')[1])
			const datetime = moment({ h, m }).add({ d: numberOfDaysAdded }).tz(timeZone).format()
			const diff = moment({ h, m }).tz(timeZone).diff(localizedDate)
			if (numberOfDaysAdded === 0) {
				if (diff > 0) {
					futureMeals.push({
						diff: diff,
						meal,
						datetime,
					})
				}
			} else {
				futureMeals.push({
					diff: diff,
					meal,
					datetime,
				})
			}
		})

		if (futureMeals.length > 0) {
			futureMeals.sort((a, b) => a.diff - b.diff)
			futureMeals.map(({ meal, datetime }) => {
				events.push({
					id: uuid(),
					name: meal.name,
					meal,
					type: 'meal',
					datetime,
				})
			})
		}

		numberOfDaysAdded++
		dayIndex++
	}

	return events
}