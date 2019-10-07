/*
 * food.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { Role } from '@Types/common'
import { Food, FoodInput, FoodListArgs, FoodsListResponse } from '@Types/food'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class FoodResolver {
  constructor(
    // service injection
    private readonly foodService: FoodService
  ) {
    // noop
  }

  @Authorized([Role.operator, Role.user])
  @Query(returns => Food)
  async food(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.getFood(id)
  }

  @Authorized([Role.operator, Role.user])
  @Query(returns => FoodsListResponse)
  async foods(
    @Args() { page, size, foodClassId, nameSearchQuery }: FoodListArgs,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.listFoods({ page, size, foodClassId, nameSearchQuery })
  }

  @Authorized([Role.operator, Role.user])
  @Mutation(returns => Food)
  async updateFood(
    @Arg('foodId') foodId: string,
    @Arg('food') food: FoodInput,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.updateFood(foodId, food)
  }

  @Authorized([Role.operator, Role.user])
  @Mutation(returns => Food)
  async deleteFood(
    @Arg('foodId') foodID: string,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.deleteFood(foodID, ctx.user!)
  }

  @Authorized([Role.operator, Role.user])
  @Mutation(returns => Food)
  async createFood(
    @Arg('foodClassId') foodClassID: string,
    @Arg('food') food: FoodInput,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.createFood(foodClassID, food)
  }

}
