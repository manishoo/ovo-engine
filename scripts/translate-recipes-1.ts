// /*
//  * translate-recipes-1.ts
//  * Copyright: Ouranos Studio 2019. All rights reserved.
//  */
//
// /**
//  * This script will fill the ingredients and instructions fields
//  * of all the recipes in the database
//  * */
// import {RecipeModel} from '~/dao/models/recipe.model'
// import CosmicOcean from '~/services/cosmic-ocean'
// const ReadableFractions = require('readable-fractions')
//
// // function transformIngredients(ingredients: Ingredient[]) {
// // 	return ingredients.map((ing) => ({
// // 		name: ing.name,
// // 		amount: ing.amount ? ReadableFractions.fractionToDecimal(ing.amount) : null,
// // 		unit: ing.unit,
// // 		description: ing.description,
// // 		food: ing.food,
// // 	}))
// // }
//
// async function main() {
// 	let count = 0
// 	let limit = 10000
//
// 	while (true) {
// 		const recipes = await RecipeModel.find({}).limit(limit).skip(count * limit).exec()
//
// 		if (recipes.length == 0) {
// 			console.log('done')
// 			process.exit(0)
// 		}
//
// 		for (let j = 0; j < recipes.length; j++) {
// 			const recipe = recipes[j]
//
// 			if (recipe.additionalData.ingredients.length == 0 || recipe.additionalData.steps.length == 0) {
// 				continue
// 			}
// 			if (recipe.instructions && typeof recipe.instructions == 'string') {
// 				recipe.instructionsRaw = recipe.instructions
// 				recipe.instructions = []
// 			}
//
// 			recipe.ingredientsRaw = recipe.additionalData.ingredients.map((ingredient: {}) => {
// 				return `${ingredient.amount ? ingredient.amount : ''} ${ingredient.unit ? ingredient.unit : ''} ${ingredient.name}`.trim()
// 			}).join('.\n')
//
// 			const {version, instructions, ingredients, latest} = await CosmicOcean.translateRecipe(recipe.ingredientsRaw, recipe.instructionsRaw, recipe.dataVersion)
// 			if (!latest) {
// 				recipe.ingredients = transformIngredients(ingredients)
// 				recipe.instructions = instructions.map((instruction) => ({
// 					text: instruction.originalText,
// 					parsedText: instruction.parsedText,
// 					actions: instruction.actionPhrases.map((ap) => ({
// 						verb: ap.action,
// 						utensil: ap.utensil ? { _id: ap.utensil.utensilId, name: ap.utensil.name }: null,
// 						ingredients: transformIngredients(ap.ingredients),
// 					})),
// 					notes: instruction.notes || [],
// 				}))
// 				recipe.dataVersion = version
//
// 				await recipe.save()
// 				console.log('Doing ', recipe.title)
// 			}
// 		}
//
// 		count++
// 	}
// }
//
// main()
// 	.then(d => console.log('Done'))
// 	.catch(e => console.error(e))
