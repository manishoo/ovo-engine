/*
 * eating.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Food } from '@Types/food'
import FoodService from '@Services/food/food.service'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'


@Service()
@Resolver()
export default class FoodResolver {
	constructor(
		// service injection
		private readonly foodService: FoodService,
	) {
		// noop
	}

	@Query(returns => Food)
	async getFood(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<Food> {
		return this.foodService.getFood(id)
	}

	@Query(returns => Food)
	async getFoodVariety(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<Food> {
		return this.foodService.getFoodVariety(id)
	}
}
