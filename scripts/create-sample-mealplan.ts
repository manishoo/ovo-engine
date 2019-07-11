/*
 * create-sample-mealplan.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealPlanner from '../src/services/food/meal-planner'
import {MealUnit} from '../src/dao/models/user.model'

function createDefaultMealDistribution(): MealUnit[] {
	return [
		{
			energyPercentageOfDay: 30,
			time: '09:00',
			name: 'Breakfast',
			availableTime: 90,
			cook: false,
		},
		{
			energyPercentageOfDay: 30,
			time: '14:00',
			name: 'Lunch',
			availableTime: 90,
			cook: true,
		},
		{
			energyPercentageOfDay: 40,
			time: '21:00',
			name: 'Dinner',
			availableTime: 90,
			cook: true,
		}
	]
}

async function main() {
	const m = await MealPlanner.generateMealPlan(createDefaultMealDistribution())

	console.log(JSON.stringify(m))
}

main()
