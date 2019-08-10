/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { Food, FoodsListResponse, FoodInput } from '@Types/food'
import { Arg, Ctx, Query, Resolver, Authorized, Mutation } from 'type-graphql'
import { Role } from '@Types/common'
import { Service } from 'typedi'
import { Context } from '../utils'

@Service()
@Resolver()
export default class FoodResolver {
	constructor(
		// service injection
		private readonly foodService: FoodService
	) {
		// noop
	}

	@Authorized(Role.operator)
	@Query(returns => FoodsListResponse)
	async foods(
		@Arg('page', { defaultValue: 1 }) page: number,
		@Arg('size', { defaultValue: 10 }) size: number,
		@Ctx() ctx: Context,
		@Arg('foodClassId', { nullable: true }) foodClassID?: string,
	) {
		return this.foodService.listFoods(page, size, foodClassID)
	}

	@Authorized(Role.operator)
	@Mutation(returns => Food)
	async updateFood(
		@Arg('food') food: FoodInput,
		@Ctx() ctx: Context,
	) {
		return this.foodService.updateFood(food)
	}

	@Authorized(Role.operator)
	@Mutation(returns => Food)
	async deleteFood(
		@Arg('id') foodID: string,
		@Ctx() ctx: Context,
	) {
		return this.foodService.deleteFood(foodID)
	}

	@Authorized(Role.operator)
	@Mutation(returns => Food)
	async createFood(
		@Arg('foodClassId') foodClassID: string,
		@Arg('food') food: FoodInput,
		@Ctx() ctx: Context,
	) {
		return this.foodService.createFood(foodClassID, food)
	}

}