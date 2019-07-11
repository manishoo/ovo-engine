/*
 * eating.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Resolver, Arg, Ctx, Query} from 'type-graphql'
import {checkUser, Context} from '../../../services/api-gateway/utils'
import FoodService from '~/services/food/food.service'
import {Food, MealItem} from '~/dao/types'
import {MEAL_ITEM_TYPES} from '~/constants/enums'
import {MealPlan} from '~/dao/models/meal-plan.model'


@Resolver()
export default class EatingResolver {
	@Query(returns => [MealItem])
	async searchMealItems(
		@Arg('q') q: string,
		@Arg('foodTypes', type => [String], {nullable: true}) foodTypes: MEAL_ITEM_TYPES[],
		@Ctx() ctx: Context,
	): Promise<MealItem[]> {
		return FoodService.searchMealItems(q, foodTypes ? foodTypes : [MEAL_ITEM_TYPES.food, MEAL_ITEM_TYPES.recipe], ctx.lang)
	}


	@Query(returns => Food)
	async getFood(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<Food> {
		return FoodService.getFood(id)
	}

	@Query(returns => Food)
	async getFoodVariety(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<Food> {
		return FoodService.getFoodVariety(id)
	}


	@Query(returns => MealPlan)
	async getMealPlan(
		// @Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<MealPlan> {
		const user = checkUser(ctx)

		return FoodService.getUserMealPlan(user.id, ctx.lang)
	}
}
