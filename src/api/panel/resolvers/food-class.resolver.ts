/*
 * food-class.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Arg, Ctx, Query, Resolver, Authorized, Mutation } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { Role, TranslationInput } from '@Types/common'
import { FoodClass } from '@Types/food-class'
import FoodClassService from '@Services/food-class/food-class.service'
import { query } from 'winston';


@Service()
@Resolver()
export default class FoodClassResolver {
	constructor(
		// service injection
        private readonly foodClassService: FoodClassService,
	) {
		// noop
    }

    @Authorized(Role.operator)
    @Query(returns => [FoodClass])
    async listFoodClasses(
        @Ctx() ctx: Context,
    ) {
        return this.foodClassService.listFoodClasses()
    }

}
