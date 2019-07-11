/*
 * create-sample-recipe.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { RecipeModel, Recipe } from '../src/dao/models/recipe.model'

async function main() {
	return new RecipeModel({
		title: 'Vegetables mix',
		ingredientsRaw: '',
		ingredients: [{
			amount: 1,
			description: undefined,
			foodId: '5facbb28-6f3b-11e9-9b76-a7f5123ade69',
			weightId: undefined,
		}, {
			amount: 2,
			description: 'chopped',
			foodId: '5fac9496-6f3b-11e9-9b76-a7f5123ade69',
			weightId: 'b3332d67-6f3b-11e9-9b76-a7f5123ade69',
		}, {
			amount: 2,
			description: 'diced',
			foodId: '5fac9489-6f3b-11e9-9b76-a7f5123ade69',
			weightId: undefined,
		}],
		instructionsRaw: 'Nothing',
		yield: 5,
	}).save()
}

main()
