/*
 * meal-item.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealItem } from '@Types/eating'
import { Food } from '@Types/food'
import { Recipe } from '@Types/recipe'
import Errors from '@Utils/errors'

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
		if (!recipe) throw new Errors.ValidationError('recipe invalid')

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
		if (!food) throw new Errors.ValidationError('food invalid')

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
		throw new Errors.ValidationError('no slug')
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
