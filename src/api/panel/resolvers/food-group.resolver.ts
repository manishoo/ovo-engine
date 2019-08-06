/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodGroupService from '@Services/food-group/food-group.service'
import { Role, TranslationInput } from '@Types/common'
import { FoodGroupInput, ParentFoodGroup } from '@Types/food-group'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'

@Service()
@Resolver()
export default class FoodGroupResolver {
	constructor(
		// service injection
		private readonly foodGroupService: FoodGroupService,
	) {
		// noop
	}

	@Authorized(Role.operator)
	@Query(returns => ParentFoodGroup)
	async foodGroup(
		@Arg('id', type => String) id: string,
		@Ctx() ctx: Context,
	) {
		return this.foodGroupService.getFoodGroup(id)
	}

	@Authorized(Role.operator)
	@Query(returns => [ParentFoodGroup])
	async foodGroups(
		@Ctx() ctx: Context,
	) {
		return this.foodGroupService.listFoodGroups()
	}

	@Authorized(Role.operator)
	@Mutation(returns => ParentFoodGroup)
	async createFoodGroup(
		@Arg('name', type => [TranslationInput]) name: TranslationInput[],
		@Arg('parentFoodGroup', type => String, { nullable: true }) parentFoodGroup?: string,
	) {
		return this.foodGroupService.addFoodGroup(name, parentFoodGroup)
	}

	@Authorized(Role.operator)
	@Mutation(returns => Boolean)
	async deleteFoodGroup(
		@Arg('id') foodGroupID: string,
	) {
		return this.foodGroupService.removeFoodGroup(foodGroupID)
	}

	@Authorized(Role.operator)
	@Mutation(returns => ParentFoodGroup)
	async editFoodGroup(
		@Arg('foodGroup') foodGroup: FoodGroupInput,
		@Ctx() ctx: Context,
	) {
		return this.foodGroupService.editFoodGroup(foodGroup)
	}
}
