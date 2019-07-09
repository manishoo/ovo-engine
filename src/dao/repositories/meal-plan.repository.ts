/*
 * meal-plan.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {MealPlan, MealPlanModel} from '~/dao/models/meal-plan.model'
import {LANGUAGE_CODES} from '~/constants/enums'
import {Recipe, RecipeModel} from '~/dao/models/recipe.model'
import FoodRepo from '~/dao/repositories/food.repository'
import {Food, MealItem} from '~/dao/types'


export default class MealPlanRepository {
	static async create(data: MealPlan) {
		try {
			const newPlan = new MealPlanModel(data)
			return newPlan.save()
		} catch (e) {
			console.log(e)
			throw e
		}
	}

	// static async getMealPlan(id: string): Promise<MealPlan> {
	// 	const mp = await MealPlanModel.findById(id)
	//
	// 	if (!mp) throw new Error('not found')
	// 	return transformMealPlan(mp.toObject())
	// }
}

export function transformMealItem(mealItem: MealItem, recipesData: Recipe[], foodsData: Food[]): MealItem {
	let title
	let subtitle
	let unitDescription
	let slug

	if (mealItem.type === 'recipe') {
		/**
		 * Recipe
		 * */
		const recipe = recipesData.find(i => i.id === mealItem.id)
		if (!recipe) throw new Error('recipe invalid')

		mealItem.totalTime = recipe.timing ? recipe.timing.totalTime : undefined
		title = recipe.title
		mealItem.thumbnail = recipe.coverImage
		subtitle = `${mealItem.amount} ${mealItem.unit}` // TODO use ingredients instead
		unitDescription = `${mealItem.amount} ${mealItem.unit}`
		slug = recipe.slug

	} else {
		/**
		 * Food
		 * */
		const food = foodsData.find(f => f.id === mealItem.id) // TODO use the real stuff
		if (!food) throw new Error('food invalid')

		title = food.name
		mealItem.thumbnail = food.thumbnail
		mealItem.totalTime = 1
		slug = food.id

		// if (mealItem.unit) {
		// 	if (food.weights) {
		// 		const foundWeight = food.weights.find(p => p.id === mealItem.unit)
		// 		if (!foundWeight) throw new Error('weight invalid')
		//
		// 		unitDescription = `${mealItem.amount} ${foundWeight.description}`
		// 	}
		// }
		// subtitle = unitDescription/* || food.foodGroup*/ // TODO use ingredients instead
	}

	if (!slug) {
		throw new Error('no slug')
	}

	return {
		title,
		subtitle,
		unitDescription,
		totalTime: mealItem.totalTime,
		id: mealItem.id,
		seq: mealItem.seq,
		unit: mealItem.unit,
		type: mealItem.type,
		amount: mealItem.amount,
		thumbnail: mealItem.thumbnail,
		slug,
	}
}

export async function transformMealPlan(mealPlan: MealPlan, lang: LANGUAGE_CODES): Promise<MealPlan> {
	let recipes: string[] = []
	let foods: string[] = []

	mealPlan.days.map(({meals}) => {
		meals.map(({items}) => {
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


	const recipesData = await RecipeModel.find({_id: {$in: recipes}})
	const foodsData = await FoodRepo.findFoodVarietiesWithIds(foods, lang)

	return {
		id: String(mealPlan._id),
		name: mealPlan.name,
		days: await Promise.all(mealPlan.days.map(async ({meals, ...rest}) => ({
			...rest,
			meals: await Promise.all(meals.map(async ({items, ...rest}) => ({
				...rest,
				items: await Promise.all(items.map(item => transformMealItem(item, recipesData, foodsData))),
			}))),
		}))),
	}
}