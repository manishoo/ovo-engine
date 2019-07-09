/*
 * dish.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {MealTemplate, MealTemplateModel} from '~/dao/models/meal-template.model'


export default {
	async create(data: MealTemplate) {
		try {
			const newDish = new MealTemplateModel(data)
			return newDish.save()
		} catch (e) {
			console.log(e)
			throw e
		}
	}
}