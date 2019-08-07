/*
 * food-class.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Arg, Authorized, Ctx, Query, Resolver, Mutation } from 'type-graphql'
import { Context } from '../utils'
import { FoodClassListResponse, FoodClass, FoodClassInput } from '@Types/food-class'
import FoodClassService from '@Services/food-class/food-class.service'
import { Role } from '@Types/common'
import { Service } from 'typedi'

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
    @Query(returns => FoodClassListResponse)
    async foodClasses(
        @Arg('page', { defaultValue: 1 }) page: number,
        @Arg('size', { defaultValue: 10 }) size: number,
        @Ctx() ctx: Context,
        @Arg('foodGroupId', {nullable: true}) foodGroupID?: string,
        @Arg('nameSearchQuery', {nullable: true}) nameSearchQuery? :string,
    ) {
        return this.foodClassService.listFoodClasses(page, size, foodGroupID, nameSearchQuery)
    }

    @Authorized(Role.operator)
    @Query(returns => FoodClass)
    async foodClass(
        @Arg('id') foodClassID: string,
        @Ctx() ctx: Context,
    ) {
        return this.foodClassService.getFoodClass(foodClassID)
    }

    @Authorized(Role.operator)
    @Query(returns => FoodClass)
    async updateFoodClass(
        @Arg('foodClass') foodClass: FoodClassInput,
        @Ctx() ctx: Context,
    ) {
        return this.foodClassService.editFoodClass(foodClass)
    }

    @Authorized(Role.operator)
    @Mutation(returns => Boolean)
    async deleteFoodClass(
        @Arg('id') foodClassID: string,
        @Ctx() ctx: Context,
    ) {
        return this.foodClassService.deleteFoodClass(foodClassID)
    }
}