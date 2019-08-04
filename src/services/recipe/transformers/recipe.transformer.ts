/*
 * recipe.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { transformRecipeUser } from '@Services/user/transformers/recipe-user.transformer'
import WeightService from '@Services/weight/weight.service'
import { LANGUAGE_CODES } from '@Types/common'
import { Recipe } from '@Types/recipe'
import { User } from '@Types/user'
import { Container } from 'typedi'
import { InstanceType } from 'typegoose'

export async function transformRecipe(recipe: InstanceType<Recipe>, userId?: string, full: boolean = false, lang: LANGUAGE_CODES = LANGUAGE_CODES.en): Promise<Recipe> {
	recipe = recipe.toObject()
	recipe.id = recipe.publicId
	recipe.likesCount = recipe.likes.length
	recipe.likedByUser = userId ? !!recipe.likes.find(p => String(p) === userId) : false

	if (Object(recipe.author).hasOwnProperty('publicId')) {
		recipe.author = transformRecipeUser(recipe.author as User)
	}

	// FIXME weight

	if (full) {
		recipe.ingredients = await Promise.all(recipe.ingredients.map(async ingredient => {
			if (ingredient.weightId) { // FIXME use population
				const weightService = Container.get(WeightService)
				ingredient.weight = await weightService.findByPublicId(ingredient.weightId, lang)
			}/* else {
			ingredient.unit = 'g' // FIXME multilanguage
		}*/

			// if (ingredient.foodId) {
			// 	const foodService = Container.get(FoodService)
			// 	const food = await foodService.findFoodVarietyByPublicId(ingredient.foodId, lang) // FIXME
			// 	if (!ingredient.name) {
			// 		ingredient.name = food.name
			// 	}
			// 	ingredient.thumbnail = food.image
			// }

			return ingredient
		}))
	}

	return recipe
}
