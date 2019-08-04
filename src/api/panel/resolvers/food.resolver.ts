/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/utils/food.service'
import { Food } from '@Types/food'
import { Arg, Ctx, Query, Resolver, Authorized } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { ROLE } from '@Types/common';

@Service()
@Resolver()
export default class FoodResolver {
	constructor(
		// service injection
		private readonly foodService: FoodService
	) {
		// noop
    }
    
    @Authorized(ROLE.operator)
    @Query(returns => [Food])
    async listFoods(
        @Arg('page') page: number,
        @Arg('size', {defaultValue: 10}) size: number,
        @Ctx() ctx: Context,
    ) {
        return this.foodService.listFoods(page, size)
     }

}
