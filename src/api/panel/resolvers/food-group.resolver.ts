/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Arg, Ctx, Query, Resolver, Authorized } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { ROLE } from '@Types/common';
import { FoodGroup } from '@Types/food-group';
import FoodGroupService from '@Services/food-group/food-group.service'

@Service()
@Resolver()
export default class FoodGroupResolver {
	constructor(
		// service injection
		private readonly foodGroupService: FoodGroupService
	) {
		// noop
    }

    @Authorized(ROLE.operator)
    @Query(returns => [FoodGroup])
    async listFoodGroups(
        @Ctx() ctx: Context,
    ) {
        return this.foodGroupService.listFoodGroups()
     }

}
