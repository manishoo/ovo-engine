/*
 * meal-plan.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { MealPlan } from '@Types/meal-plan'
import { Container } from 'typedi'
import { LANGUAGE_CODES } from '@Types/common'
import { RecipeModel } from '@Models/recipe.model'
import { transformMealItem } from './meal-item.transformer'

export async function transformMealPlan(mealPlan: MealPlan, lang: LANGUAGE_CODES): Promise<MealPlan> {
	let recipes: string[] = []
	let foods: string[] = []

	mealPlan.days.map(({ meals }) => {
		meals.map(({ items }) => {
			items.map(item => {
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
		})
	})


	const recipesData = await RecipeModel.find({ _id: { $in: recipes } }) // FIXME
	const foodService = Container.get(FoodService)
	const foodsData = await foodService.findFoodVarietiesWithIds(foods, lang)

	return {
		id: String(mealPlan._id),
		name: mealPlan.name,
		days: await Promise.all(mealPlan.days.map(async ({ meals, ...rest }) => ({
			...rest,
			meals: await Promise.all(meals.map(async ({ items, ...rest }) => ({
				...rest,
				items: await Promise.all(items.map(item => transformMealItem(item, recipesData, foodsData))),
			}))),
		}))),
	}
}
