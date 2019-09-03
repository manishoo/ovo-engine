/*
 * food-group.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodGroupService from '@Services/food-group/food-group.service'
import { OperatorRole, TranslationInput } from '@Types/common'
import { FoodGroupInput, ParentFoodGroup } from '@Types/food-group'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'


@Service()
@Resolver()
export default class FoodGroupResolver {
  constructor(
    // service injection
    private readonly foodGroupService: FoodGroupService,
  ) {
    // noop
  }

  @Authorized(OperatorRole.operator)
  @Query(returns => ParentFoodGroup)
  async foodGroup(
    @Arg('id', type => String) id: string,
    @Ctx() ctx: Context,
  ) {
    return this.foodGroupService.getFoodGroup(id)
  }

  @Authorized(OperatorRole.operator)
  @Query(returns => [ParentFoodGroup])
  async foodGroups(
    @Ctx() ctx: Context,
  ) {
    return this.foodGroupService.listFoodGroups()
  }

  @Authorized(OperatorRole.operator)
  @Mutation(returns => ParentFoodGroup)
  async createFoodGroup(
    @Arg('name', type => [TranslationInput]) name: TranslationInput[],
    @Arg('parentFoodGroup', type => String, { nullable: true }) parentFoodGroup?: string,
  ) {
    return this.foodGroupService.addFoodGroup(name, parentFoodGroup)
  }

  @Authorized(OperatorRole.operator)
  @Mutation(returns => Boolean)
  async deleteFoodGroup(
    @Arg('id') foodGroupID: string,
  ) {
    return this.foodGroupService.removeFoodGroup(foodGroupID)
  }

  @Authorized(OperatorRole.operator)
  @Mutation(returns => ParentFoodGroup)
  async editFoodGroup(
    @Arg('foodGroup') foodGroup: FoodGroupInput,
    @Ctx() ctx: Context,
  ) {
    return this.foodGroupService.editFoodGroup(foodGroup)
  }
}
