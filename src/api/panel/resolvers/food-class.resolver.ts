/*
 * food-class.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodClassService from '@Services/food-class/food-class.service'
import { Role } from '@Types/common'
import { FoodClass, FoodClassInput, FoodClassListResponse, ListFoodClassesArgs } from '@Types/food-class'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'


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
  @Query(returns => FoodClass)
  async foodClass(
    @Arg('id') foodClassID: string,
    @Ctx() ctx: Context,
  ) {
    return this.foodClassService.getFoodClass(foodClassID)
  }

  @Authorized(Role.operator)
  @Query(returns => FoodClassListResponse)
  async foodClasses(
    @Args() { page, size, foodGroupId, nameSearchQuery, verified }: ListFoodClassesArgs,
    @Ctx() ctx: Context,
  ) {
    return this.foodClassService.listFoodClasses({ page, size, foodGroupId, nameSearchQuery, verified })
  }

  @Authorized(Role.operator)
  @Mutation(returns => FoodClass)
  async updateFoodClass(
    @Arg('id') foodClassId: string,
    @Arg('foodClass') foodClass: FoodClassInput,
    @Ctx() ctx: Context,
  ) {
    return this.foodClassService.editFoodClass(foodClassId, foodClass)
  }

  @Authorized(Role.operator)
  @Mutation(returns => String)
  async deleteFoodClass(
    @Arg('id') foodClassID: string,
    @Ctx() ctx: Context,
  ) {
    return this.foodClassService.deleteFoodClass(foodClassID)
  }

  @Authorized(Role.operator)
  @Mutation(returns => FoodClass)
  async createFoodClass(
    @Arg('foodClass') foodClass: FoodClassInput,
    @Ctx() ctx: Context,
  ) {
    return this.foodClassService.createFoodClass(foodClass)
  }
}
