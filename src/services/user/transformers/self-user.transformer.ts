/*
 * self-user.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { transformMealItem } from '@Services/meal-plan/transformers/meal-item.transformer'
import { LANGUAGE_CODES } from '@Types/common'
import { EVENT_TYPES } from '@Types/event'
import { User } from '@Types/user'
import { Container } from 'typedi'
import { InstanceType } from 'typegoose'
import { RecipeModel } from '@Models/recipe.model'

export default async function transformSelfUser(userDocument: InstanceType<User>, lang: LANGUAGE_CODES = LANGUAGE_CODES.en) {
	userDocument = userDocument.toObject()
	userDocument.id = String(userDocument.publicId)
	if (userDocument.path) {
		// FIXME PLEASE! :(((
		let recipes: string[] = []
		let foods: string[] = []

		userDocument.path.map(({ meal }) => {
			if (meal) {
				meal.items.map(item => {
					switch (item.type) {
						case 'recipe':
							if (!recipes.find(p => p === item.id)) {
								return recipes.push(item.id)
							}
							return
						case 'food':
							// weights.push(item)
							if (!foods.find(f => f === item.id)) {
								return foods.push(item.id)
							}
							return
						default:
							return
					}
				})
			}
		})

		const recipesData = await RecipeModel.find({ _id: { $in: recipes } }) // FIXME
		const foodService = Container.get(FoodService)
		const foodsData = await foodService.findFoodVarietiesWithIds(foods, lang) // FIXME

		userDocument.path = await Promise.all(userDocument.path.map(async event => {
			if (event.type === EVENT_TYPES.meal && event.meal) {
				event.meal.items = await Promise.all(event.meal.items.map(item => transformMealItem(item, recipesData, foodsData)))
			}

			return event
		}))
	}
	return userDocument
}