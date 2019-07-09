/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import RecipeRepo from 'src/dao/repositories/recipe.repository'
import {MealPlan} from 'src/dao/models/meal-plan.model'
import UserRepo from 'src/dao/repositories/user.repository'
import FoodRepo from 'src/dao/repositories/food.repository'
import {LANGUAGE_CODES, MEAL_ITEM_TYPES} from 'src/constants/enums'
import {Recipe} from 'src/dao/models/recipe.model'
// import FoodRepo from '~/dao/repositories/food.repository'
// import MealPlanner from './meal-planner'
// import {MealItem} from '~/dao/types'
// import {getEditDistance} from '~/utils/levenshtein'
import MealPlanner from './meal-planner'
import {Food, MealItem} from 'src/dao/types'
import {getEditDistance} from 'src/utils/levenshtein'

interface MealPlanOptions {
	name: string
}

class FoodService {
	async getRecipe(slug: string, userId?: string): Promise<Recipe> {
		return RecipeRepo.findById(slug, userId)
	}

	async getFood(id: string): Promise<Food> {
		return FoodRepo.findFoodByPublicId(id, LANGUAGE_CODES.en) // TODO fixme
	}

	async getFoodVariety(id: string): Promise<Food> {
		return FoodRepo.findFoodVarietyByPublicId(id, LANGUAGE_CODES.en)
	}

	async generateMealPlan(userId: string): Promise<MealPlan> {
		const user = await UserRepo.findById(userId)
		if (!user.meals) throw new Error('no meals')

		const plan = await MealPlanner.generateMealPlan(user.meals)
		// const plans = user.mealPlans ? [...user.mealPlans, plan._id] : [plan._id]
		// console.log('==============>', p)
		user.mealPlans = user.mealPlans ? [...user.mealPlans, plan._id] : [plan._id]
		await UserRepo.modify(userId, user)
		// do something
		return plan
	}

	async getUserMealPlan(userId: string, lang: LANGUAGE_CODES): Promise<MealPlan> {
		const c = await UserRepo.getUserMealPlan(userId, lang)
		console.log('========', c)
		return c
	}

	// async generateMealPlan(userId, options) {
	// 	const user = await UserRepo.findById(userId)
	// 	const plan = new MealPlan()
	// 	plan.name = options.name
	//
	// 	if (user.meals.length == 0) {
	// 		throw Error(__('userHasNoMeals'))
	// 	}
	//
	// 	for (const day in WEEKDAYS) {
	// 		// @ts-ignore
	// 		plan[day] = {
	// 			meals: []
	// 		}
	// 		for (const meal of user.meals) {
	// 			// @ts-ignore
	// 			plan[day].meals.push({
	// 				...meal,
	// 				// TODO fill food
	// 			})
	// 		}
	// 	}
	//
	// 	return MealPlanRepo.create(plan)
	// },

	private async _searchFoods(q: string, lang: LANGUAGE_CODES): Promise<Food[]> {
		// FIXME better search
		let foods = await FoodRepo.findFoodVariety({
			query: q,
			limit: 5,
			lang,
			shouldIncludeNutrients: true,
		})

		return foods.foods
	}

	private async _searchRecipes(q: string): Promise<Recipe[]> {
		let recipes = await RecipeRepo.find(5, 0, q)

		return recipes.recipes
	}

	async searchMealItems(q: string, foodTypes: MEAL_ITEM_TYPES[], lang: LANGUAGE_CODES): Promise<MealItem[]> {
		// search through foods and recipes
		const foods = foodTypes.find(p => p === MEAL_ITEM_TYPES.food) ? await this._searchFoods(q, lang) : []
		// FIXME handle language in recipes search
		const recipes = foodTypes.find(p => p === MEAL_ITEM_TYPES.recipe) ? await this._searchRecipes(q) : []

		const mealItems: MealItem[] = []

		foods.forEach((food: Food) => {
			mealItems.push({
				title: food.name,
				subtitle: food.foodGroup ? food.foodGroup.map(fg => fg.name).join(', ') : '',
				thumbnail: food.image ? food.image : undefined,
				id: food.id,
				type: MEAL_ITEM_TYPES.food,
				weights: food.weights,
				nutritionalData: food.nutrients,
				// varieties: food.varieties,
				// subtitle: food.,
			})
		})

		recipes.forEach((recipe: Recipe) => {
			mealItems.push({
				title: recipe.title,
				thumbnail: recipe.thumbnail ? recipe.thumbnail : undefined,
				id: recipe.id,
				type: MEAL_ITEM_TYPES.recipe,
				// subtitle: food.,
			})
		})

		mealItems.sort((a, b) => getEditDistance(q, a.title || ''))
		mealItems.splice(10)

		return mealItems
	}
}

const foodService = new FoodService()

export default foodService
