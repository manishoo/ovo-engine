/*
 * food.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { Role, ObjectId } from '@Types/common'
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
    @Arg('id') id: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.get(id)
  }

  @Authorized([Role.operator, Role.user])
  @Query(returns => FoodsListResponse)
  async foods(
    @Args() args: FoodListArgs,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.list(args)
  }

  @Authorized([Role.operator, Role.user])
  @Mutation(returns => Food)
  async updateFood(
    @Arg('foodId') foodId: ObjectId,
    @Arg('food') food: FoodInput,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.update(foodId, food)
  }

  @Authorized([Role.operator, Role.user])
  @Mutation(returns => Food)
  async deleteFood(
    @Arg('foodId') foodId: ObjectId,
    @Ctx() ctx: Context,
    @Arg('restore', { nullable: true }) restore?: boolean,
  ) {
    return this.foodService.delete(foodId, ctx.user!, restore)
  }

  @Authorized([Role.operator, Role.user])
  @Mutation(returns => Food)
  async createFood(
    @Arg('foodClassId') foodClassId: ObjectId,
    @Arg('food') food: FoodInput,
    @Ctx() ctx: Context,
  ) {
    return this.foodService.create(foodClassId, food)
  }
}
