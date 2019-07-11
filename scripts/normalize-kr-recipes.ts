/*
 * normalize-kr-recipes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/**
 * This script will fill the ingredients and instructions fields
 * of all the recipes in the database
 * */
// import {RecipeModel} from '~/dao/repositories/recipe.repository'
import CosmicOcean from '~/services/cosmic-ocean'

const ReadableFractions = require('readable-fractions')

function transformIngredients(ingredients: any) {
	return ingredients.map((ing: any) => ({
		name: ing.name,
		amount: ing.amount ? ReadableFractions.fractionToDecimal(ing.amount) : null,
		unit: ing.unit,
		description: ing.description,
		food: ing.food,
	}))
}

const recipesReviewd = []

export async function normalizeKR(recipe: any) {
	// if (recipesReviewd.find(a => (a.title == recipe.title && a.instructionsRaw == recipe.instructionsRaw))) {
	// 	await recipe.remove()
	// 	return null
	// }

	if (recipe.ingredients.length == 0 || recipe.steps.length == 0) {
		return null
	}

	recipe.instructionsRaw = recipe.steps.map((s: any) => s.text).join('\n') || ' '
	recipe.instructions = []

	recipe.ingredientsRaw = recipe.ingredients.map((ingredient: any) => {
		return `${ingredient.amount ? ingredient.amount : ''} ${ingredient.unit ? ingredient.unit : ''} ${ingredient.name}`.trim()
	}).join('.\n')

	const {version, instructions, ingredients, latest} = await CosmicOcean.translateRecipe(recipe.ingredientsRaw, recipe.instructionsRaw, recipe.dataVersion)
	if (!latest) {
		recipe.ingredients = transformIngredients(ingredients)
		recipe.instructions = instructions.map((instruction: any) => ({
			text: instruction.originalText,
			parsedText: instruction.parsedText,
			actions: instruction.actionPhrases.map((ap: any) => ({
				verb: ap.action,
				utensil: ap.utensil ? {_id: ap.utensil.utensilId, name: ap.utensil.name} : null,
				ingredients: transformIngredients(ap.ingredients),
			})),
			notes: instruction.notes || [],
		}))
		recipe.dataVersion = version

		console.log('Doing ', recipe.title)
		return recipe
	}

	return null
}
