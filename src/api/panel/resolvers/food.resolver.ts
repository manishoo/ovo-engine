/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { Food, FoodsListResponse } from '@Types/food'
import { Arg, Ctx, Query, Resolver, Authorized } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { Role } from '@Types/common';

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
    async listFoods(
        @Arg('page', { defaultValue: 1 }) page: number,
        @Arg('size', { defaultValue: 10 }) size: number,
        @Ctx() ctx: Context,
        @Arg('foodClassId', {nullable: true}) foodClassID?: string,
    ) {
        return this.foodService.listFoods(page, size, foodClassID)
    }

}
