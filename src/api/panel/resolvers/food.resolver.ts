/*
 * food.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { Role } from '@Types/common'
import { Food, FoodInput, FoodsListResponse } from '@Types/food'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
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
