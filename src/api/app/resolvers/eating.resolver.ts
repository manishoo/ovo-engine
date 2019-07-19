/*
 * eating.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { MealItem } from '@Types/eating'
import { MealPlan } from '@Types/meal-plan'
import { MEAL_ITEM_TYPES } from '@Types/meals'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { checkUser, Context } from '../utils'


@Resolver()
export default class FoodResolver {
	constructor(
		// service injection
		private readonly foodService: FoodService,
	) {
		// noop
	}

	@Query(returns => [MealItem])
	async searchMealItems(
		@Arg('q') q: string,
		@Arg('foodTypes', type => [String], { nullable: true }) foodTypes: MEAL_ITEM_TYPES[],
		@Ctx() ctx: Context,
	): Promise<MealItem[]> {
		return this.foodService.searchMealItems(q, foodTypes ? foodTypes : [MEAL_ITEM_TYPES.food, MEAL_ITEM_TYPES.recipe], ctx.lang)
	}

	@Query(returns => MealPlan)
	async getMealPlan(
		// @Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<MealPlan> {
		const user = checkUser(ctx)

		return this.foodService.getUserMealPlan(user.id, ctx.lang)
	}
}
