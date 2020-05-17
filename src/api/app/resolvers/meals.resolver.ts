/*
 * meal.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealService from '@Services/meal/meal.service'
import { ObjectId, Role } from '@Types/common'
import { ListMealsArgs, Meal, MealInput, MealListResponse } from '@Types/meal'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class MealsResolver {
  constructor(
    // service injection
    private readonly mealService: MealService
  ) {
    // noop
  }

  @Authorized(Role.user)
  @Query(returns => Meal)
  async meal(
    @Ctx() ctx: Context,
    @Arg('id', { nullable: true }) id?: ObjectId,
    @Arg('slug', { nullable: true }) slug?: string,
  ) {
    return this.mealService.get(id, slug)
  }

  @Authorized(Role.user)
  @Query(returns => MealListResponse)
  async meals(
    @Args() { page, size, authorId, lastId }: ListMealsArgs,
    @Ctx() ctx: Context,
  ) {
    return this.mealService.list({ page, size, authorId, lastId })
  }

  @Authorized(Role.user)
  @Mutation(returns => Meal)
  async createMeal(
    @Arg('meal') meal: MealInput,
    @Ctx() ctx: Context,
    @Arg('bulkCreate', { nullable: true }) bulkCreate?: boolean,
  ) {
    return this.mealService.create(meal, ctx.user!.id, bulkCreate)
  }

  @Authorized(Role.user)
  @Mutation(returns => Meal)
  async updateMeal(
    @Arg('id') id: ObjectId,
    @Arg('data') data: MealInput,
    @Ctx() ctx: Context,
  ) {
    return this.mealService.update(id, data, ctx.user!.id)
  }

  @Authorized(Role.user)
  @Mutation(returns => String)
  async deleteMeal(
    @Arg('id') id: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.mealService.delete(id, ctx.user!)
  }
}
