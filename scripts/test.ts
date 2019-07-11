/*
 * test.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

// import FR from '~/dao/repositories/food.repository'
// import {LANGUAGE_CODES} from '~/constants/enums'
import {generatePath} from '~/services/user.service'
import {MealPlanModel} from '~/dao/models/meal-plan.model'

async function main() {
	const mp = await MealPlanModel.findById('5cd29e6e45e7386045e824b8')
	if (!mp) throw 'Error'
	const path = generatePath(mp.toObject(), 'Asia/Tehran')
	console.log('PATH', path)
}

main()
