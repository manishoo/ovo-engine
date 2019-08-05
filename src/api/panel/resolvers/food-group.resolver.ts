/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Arg, Ctx, Query, Resolver, Authorized, Mutation } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { Role, TranslationInput } from '@Types/common'
import { FoodGroup } from '@Types/food-group'
import FoodGroupService from '@Services/food-group/food-group.service'


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
    @Query(returns => [FoodGroup])
    async listFoodGroups(
        @Ctx() ctx: Context,
    ) {
        return this.foodGroupService.listFoodGroups()
     }

    @Authorized(Role.operator)
    @Mutation(returns => FoodGroup)
    async createFoodGroup(
        @Arg('name', type => [TranslationInput]) name: TranslationInput[],
        @Arg('parentFoodGroup', type => String, {nullable: true}) parentFoodGroup?: string,
    ) {
        return this.foodGroupService.addFoodGroup(name, parentFoodGroup)
     }

}
